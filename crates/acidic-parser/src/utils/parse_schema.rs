use super::helpers::{parsing_catch_all, Pair};
use super::parse_comments::parse_comment_block;
use super::string_literal::parse_string_literal;
use super::{
  parse_data_source::parse_data_source, parse_definition::parse_definition,
  parse_enumeration::parse_enumeration, parse_model::parse_model, parse_plugin::parse_plugin,
};
use crate::ast::{
  attribute_ast::AttributeAst, config_ast::ConfigAst, definition_ast::DefinitionAst,
  enumeration_ast::EnumerationAst, model_ast::ModelAst, schema_ast::ImportAst,
  schema_ast::SchemaAst,
};
use crate::parser::{AcidicParser, Rule};
use acidic_diagnostics::{Diagnostics, SchemaError};
use pest::Parser;
use std::collections::HashMap;

/// Parse a server schema string and return its AST.
pub fn parse_schema(schema_string: &str, diagnostics: &mut Diagnostics) -> SchemaAst {
  let schema_result = AcidicParser::parse(Rule::schema, schema_string);

  let id: Option<String> = None;
  let mut imports: Vec<ImportAst> = Vec::new();
  let mut comments: Vec<String> = Vec::new();
  let attributes: Vec<AttributeAst> = Vec::new();

  let mut data_sources: HashMap<String, ConfigAst> = HashMap::new();
  let mut plugins: HashMap<String, ConfigAst> = HashMap::new();
  let mut models: HashMap<String, ModelAst> = HashMap::new();
  let mut definitions: HashMap<String, DefinitionAst> = HashMap::new();
  let mut enumerations: HashMap<String, EnumerationAst> = HashMap::new();

  match schema_result {
    Ok(mut schema_wrapped) => {
      let schema = schema_wrapped.next().unwrap();
      let mut pending_block_comment = None;
      let mut pairs = schema.into_inner().peekable();

      while let Some(current) = pairs.next() {
        match current.as_rule() {
                    Rule::import_statement => {
                        imports.push(parse_import(current, pending_block_comment.take(), diagnostics));
                    },
                    Rule::model_declaration => {
                        let keyword = current
                            .clone()
                            .into_inner()
                            .find(|pair| matches!(pair.as_rule(), Rule::TYPE_KEYWORD | Rule::MODEL_KEYWORD | Rule::VIEW_KEYWORD)).expect("Expected model, type or view keyword");


                        match keyword.as_rule() {
                            Rule::TYPE_KEYWORD => {
                                let definition = parse_definition(current, pending_block_comment.take(), diagnostics);
                                definitions.insert(definition.id.clone(), definition);
                            }
                            Rule::MODEL_KEYWORD => {
                                let comment = pending_block_comment.take();

                                let model = parse_model(current.clone(), comment.clone(), diagnostics);
                                models.insert(model.id.clone(), model);

                                let definition = parse_definition(current, comment.clone(), diagnostics);
                                definitions.insert(definition.id.clone(), definition);
                            }
                            Rule::VIEW_KEYWORD => {
                                let comment = pending_block_comment.take();

                                let model = parse_model(current.clone(), comment.clone(), diagnostics);
                                models.insert(model.id.clone(), model);

                                let definition = parse_definition(current, comment.clone(), diagnostics);
                                definitions.insert(definition.id.clone(), definition);
                            }
                            _ => unreachable!(),
                        }
                    },
                    Rule::enumeration_declaration => {
                        let enumeration = parse_enumeration(current, pending_block_comment.take(), diagnostics);
                        enumerations.insert(enumeration.id.clone(), enumeration);
                    },
                    Rule::config_declaration => {
                        let keyword = current
                            .clone()
                            .into_inner()
                            .find(|pair| matches!(pair.as_rule(), Rule::DATASOURCE_KEYWORD | Rule::PLUGIN_KEYWORD | Rule::GENERATOR_KEYWORD)).expect("Expected datasource, service, generator, or plugin keyword");

                        match keyword.as_rule() {
                            Rule::DATASOURCE_KEYWORD => {
                                let data_source = parse_data_source(current, pending_block_comment.take(), diagnostics);
                                data_sources.insert(data_source.id.clone(), data_source);
                            }
                            Rule::PLUGIN_KEYWORD => {
                                let plugin = parse_plugin(current, pending_block_comment.take(), diagnostics);
                                plugins.insert(plugin.id.clone(), plugin);

                            }
                            Rule::GENERATOR_KEYWORD => {
                                let plugin = parse_plugin(current, pending_block_comment.take(), diagnostics);
                                plugins.insert(plugin.id.clone(), plugin);
                            }
                            _ => unreachable!(),
                        }
                    },
                    Rule::type_alias => {
                        let error = SchemaError::new_validation_error(
                            "Invalid type definition. Please check the documentation in https://pris.ly/d/composite-types",
                            current.as_span().into()
                        );

                        diagnostics.push_error(error);
                    }
                    Rule::comment_block => {
                        match pairs.peek().map(|b| b.as_rule()) {
                            Some(Rule::empty_lines) => {
                                comments.push(parse_comment_block(current).unwrap());
                            }
                            Some(Rule::model_declaration) | Some(Rule::enumeration_declaration) | Some(Rule::config_declaration) => {
                                pending_block_comment = Some(current);
                            }
                            _ => (),
                        }
                    },
                    Rule::EOI => {}
                    Rule::CATCH_ALL => diagnostics.push_error(SchemaError::new_validation_error(
                        "This line is invalid. It does not start with any known Acidic schema keyword.",
                        current.as_span().into(),
                    )),
                    Rule::arbitrary_block => diagnostics.push_error(SchemaError::new_validation_error(
                        "This block is invalid. It does not start with any known Acidic schema keyword. Valid keywords include \'model\', \'enumeration\', \'type\', \'datasource\' and \'generator\'.",
                        current.as_span().into(),
                    )),
                    Rule::empty_lines => (),
                    _ => unreachable!(),
                }
      }

      SchemaAst {
        id,
        imports,
        comments,
        attributes,
        data_sources,
        plugins,
        enumerations,
        models,
        definitions,
      }
    }
    Err(err) => {
      let location: pest::Span<'_> = match err.location {
        pest::error::InputLocation::Pos(pos) => pest::Span::new(schema_string, pos, pos).unwrap(),
        pest::error::InputLocation::Span((from, to)) => {
          pest::Span::new(schema_string, from, to).unwrap()
        }
      };

      let expected = match err.variant {
        pest::error::ErrorVariant::ParsingError { positives, .. } => {
          get_expected_from_error(&positives)
        }
        _ => panic!("Could not construct parsing error. This should never happend."),
      };

      diagnostics.push_error(SchemaError::new_parser_error(expected, location.into()));

      SchemaAst {
        id,
        imports,
        comments,
        attributes,
        data_sources,
        plugins,
        enumerations,
        models,
        definitions,
      }
    }
  }
}

fn get_expected_from_error(positives: &[Rule]) -> String {
  use std::fmt::Write as _;
  let mut out = String::with_capacity(positives.len() * 6);

  for positive in positives {
    write!(out, "{positive:?}").unwrap();
  }

  out
}

fn parse_import(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> ImportAst {
  let mut id: Option<String> = None;
  let mut path: Option<String> = None;

  let mut comments: Vec<String> = Vec::new();
  if let Some(comment) = doc_comment {
    comments.push(parse_comment_block(comment).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::import_with_identifier => {
        for item in current.into_inner() {
          match item.as_rule() {
            Rule::IMPORT_KEYWORD | Rule::FROM_KEYWORD => continue,
            Rule::identifier => id = Some(item.as_str().to_owned().into()),
            Rule::string_literal => path = Some(parse_string_literal(item, diagnostics)),
            Rule::BLOCK_LEVEL_CATCH_ALL => {
              diagnostics.push_error(SchemaError::new_validation_error(
                "This line is not a valid field or attribute definition.",
                item.as_span().into(),
              ))
            }
            _ => parsing_catch_all(&item, "model"),
          }
        }
      }
      Rule::import_without_identifier => {
        for item in current.into_inner() {
          match item.as_rule() {
            Rule::IMPORT_KEYWORD => continue,
            Rule::string_literal => path = Some(parse_string_literal(item, diagnostics)),
            Rule::BLOCK_LEVEL_CATCH_ALL => {
              diagnostics.push_error(SchemaError::new_validation_error(
                "This line is not a valid field or attribute definition.",
                item.as_span().into(),
              ))
            }
            _ => parsing_catch_all(&item, "model"),
          }
        }
      }
      _ => parsing_catch_all(&current, "import"),
    }
  }

  ImportAst {
    id,
    path: path.expect("A file path or URL to a valid schema file is required for an import"),
    comments,
  }
}
