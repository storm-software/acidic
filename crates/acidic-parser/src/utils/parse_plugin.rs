use super::parse_comments::*;
use crate::ast::{
  attribute_ast::AttributeAst, config_ast::ConfigAst, expression_ast::ExpressionAst,
};
use crate::parser::Rule;
use crate::utils::{
  helpers::{parsing_catch_all, Pair},
  parse_attribute::parse_attribute,
  parse_config::parse_key_value,
};
use acidic_diagnostics::{Diagnostics, SchemaError};
use indexmap::IndexMap;

pub(crate) fn parse_plugin(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> ConfigAst {
  let mut id: Option<String> = None;
  let mut keyword: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = Vec::new();
  let mut properties: IndexMap<String, ExpressionAst> = IndexMap::new();

  let mut comments: Vec<String> = Vec::new();
  if let Some(comment) = doc_comment {
    comments.push(parse_comment_block(comment).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::config_contents => {
        for item in current.into_inner() {
          match item.as_rule() {
            Rule::key_value => {
              let property = parse_key_value(item.clone(), diagnostics);
              if let Some(_) = properties.get(&property.0) {
                diagnostics.push_error(SchemaError::new_validation_error(
                  "This property is already defined in the DataSource.",
                  item.clone().as_span().into(),
                ));
              } else if let Some(value) = &property.1 {
                properties.insert(property.0.clone(), value.clone());
              }
            }
            Rule::comment_block => continue,
            Rule::BLOCK_LEVEL_CATCH_ALL => {
              diagnostics.push_error(SchemaError::new_validation_error(
                "This line is not a valid definition within a DataSource.",
                item.as_span().into(),
              ));
            }
            _ => parsing_catch_all(&item, "source"),
          }
        }
      }
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::block_attribute => attributes.push(parse_attribute(current, diagnostics)),
      Rule::GENERATOR_KEYWORD | Rule::PLUGIN_KEYWORD => {
        keyword = Some(current.as_str().to_owned().into())
      }
      Rule::BLOCK_OPEN | Rule::BLOCK_CLOSE => continue,
      _ => parsing_catch_all(&current, "source"),
    }
  }

  ConfigAst {
    id: id.expect("A name is required for all configuration types"),
    keyword: keyword.expect("A keyword is required for all configuration types"),
    comments,
    attributes,
    properties,
  }
}
