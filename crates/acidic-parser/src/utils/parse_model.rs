use super::{parse_attribute::parse_attribute, parse_comments::*};
use crate::ast::attribute_ast::AttributeAst;
use crate::ast::model_ast::ModelAst;
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::{Diagnostics, SchemaError};

pub(crate) fn parse_model(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> ModelAst {
  let mut id: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = Vec::new();
  let mut is_view = false;

  let mut comments: Vec<String> = vec![];
  if let Some(comment_block) = doc_comment {
    comments.push(parse_comment_block(comment_block).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::MODEL_KEYWORD | Rule::BLOCK_OPEN | Rule::BLOCK_CLOSE => continue,
      Rule::VIEW_KEYWORD => is_view = true,
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::model_contents => {
        for item in current.into_inner() {
          match item.as_rule() {
            Rule::block_attribute => attributes.push(parse_attribute(item, diagnostics)),
            Rule::field_declaration => continue,
            Rule::comment_block => continue,
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

  ModelAst {
    id: id.expect("Identifier not found in model declaration"),
    attributes,
    comments,
    is_view,
  }
}
