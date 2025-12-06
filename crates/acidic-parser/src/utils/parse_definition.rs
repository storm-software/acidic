use super::{parse_attribute::parse_attribute, parse_comments::*, parse_field::parse_field};
use crate::ast::{attribute_ast::AttributeAst, definition_ast::DefinitionAst, field_ast::FieldAst};
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::{Diagnostics, SchemaError};
use indexmap::IndexMap;

pub(crate) fn parse_definition(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> DefinitionAst {
  let mut id: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = Vec::new();
  let mut fields: IndexMap<String, FieldAst> = IndexMap::new();

  let mut comments: Vec<String> = vec![];
  if let Some(comment_block) = doc_comment {
    comments.push(parse_comment_block(comment_block).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::TYPE_KEYWORD
      | Rule::MODEL_KEYWORD
      | Rule::VIEW_KEYWORD
      | Rule::BLOCK_OPEN
      | Rule::BLOCK_CLOSE => continue,
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::model_contents => {
        let mut pending_field_comment: Option<Pair<'_>> = None;

        for item in current.into_inner() {
          match item.as_rule() {
            Rule::block_attribute => attributes.push(parse_attribute(item, diagnostics)),
            Rule::field_declaration => {
              match parse_field("model", item, pending_field_comment.take(), diagnostics) {
                Ok(field) => {
                  fields.insert(field.id.clone(), field.clone());
                }
                Err(err) => diagnostics.push_error(err),
              }
            }
            Rule::comment_block => pending_field_comment = Some(item),
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
      _ => parsing_catch_all(&current, "model"),
    }
  }

  DefinitionAst {
    id: id.expect("Identifier not found in type declaration"),
    fields,
    attributes,
    comments,
  }
}
