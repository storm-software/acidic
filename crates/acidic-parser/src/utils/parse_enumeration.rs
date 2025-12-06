use super::{parse_attribute::parse_attribute, parse_comments::*};
use crate::ast::attribute_ast::AttributeAst;
use crate::ast::enumeration_ast::{EnumerationAst, EnumerationValueAst};
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::{Diagnostics, SchemaError};
use indexmap::IndexMap;

pub fn parse_enumeration(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> EnumerationAst {
  let mut id: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = vec![];
  let mut values: IndexMap<String, EnumerationValueAst> = IndexMap::new();
  let pairs = pair.into_inner().peekable();

  let mut comments: Vec<String> = Vec::new();
  if let Some(comment) = doc_comment {
    comments.push(parse_comment_block(comment).unwrap());
  }

  for current in pairs {
    match current.as_rule() {
      Rule::BLOCK_OPEN | Rule::BLOCK_CLOSE | Rule::ENUM_KEYWORD => continue,
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::enumeration_contents => {
        let mut pending_value_comment = None;

        for item in current.into_inner() {
          match item.as_rule() {
            Rule::block_attribute => attributes.push(parse_attribute(item, diagnostics)),
            Rule::enumeration_value_declaration => {
              match parse_enumeration_value(item, pending_value_comment.take(), diagnostics) {
                Ok(enumeration_value) => {
                  values.insert(enumeration_value.id.clone(), enumeration_value.clone());
                }
                Err(err) => diagnostics.push_error(err),
              }
            }
            Rule::comment_block => pending_value_comment = Some(item),
            Rule::BLOCK_LEVEL_CATCH_ALL => {
              diagnostics.push_error(SchemaError::new_validation_error(
                "This line is not an enumeration value definition.",
                item.as_span().into(),
              ))
            }
            _ => parsing_catch_all(&item, "enumeration"),
          }
        }
      }
      _ => parsing_catch_all(&current, "enumeration"),
    }
  }

  match id {
    Some(id) => EnumerationAst { id, values, attributes, comments },
    _ => panic!("Encountered impossible enumeration declaration during parsing, name is missing.",),
  }
}

fn parse_enumeration_value(
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> Result<EnumerationValueAst, SchemaError> {
  let pair_str = pair.as_str();
  let mut id: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = vec![];

  let mut comments: Vec<String> = vec![];
  if let Some(comment_block) = doc_comment {
    comments.push(parse_comment_block(comment_block).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::field_attribute => attributes.push(parse_attribute(current, diagnostics)),
      Rule::trailing_comment => {
        if let Some(res) = parse_trailing_comment(current) {
          comments.push(res);
        }
      }
      Rule::comment_block => {
        parse_comment_block(current);
      }
      _ => parsing_catch_all(&current, "enumeration value"),
    }
  }

  match id {
    Some(id) => Ok(EnumerationValueAst {
        id,
      attributes,
      comments
    }),
    _ => panic!(
      "Encountered impossible enumeration value declaration during parsing, name is missing: {pair_str:?}",
    ),
  }
}
