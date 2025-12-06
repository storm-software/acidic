use super::{parse_attribute::parse_attribute, parse_comments::*};
use crate::ast::attribute_ast::AttributeAst;
use crate::ast::field_ast::{FieldAst, FieldTypeAst};
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::{Diagnostics, SchemaError};
use std::str::FromStr;

pub(crate) fn parse_field(
  container_type: &'static str,
  pair: Pair<'_>,
  doc_comment: Option<Pair<'_>>,
  diagnostics: &mut Diagnostics,
) -> Result<FieldAst, SchemaError> {
  let pair_span = pair.as_span();
  let mut id: Option<String> = None;
  let mut attributes: Vec<AttributeAst> = Vec::new();
  let mut r#type: Option<(bool, bool, FieldTypeAst)> = None;

  let mut comments: Vec<String> = vec![];
  if let Some(comment) = doc_comment {
    comments.push(parse_comment_block(comment).unwrap());
  }

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::identifier => id = Some(current.as_str().to_owned().into()),
      Rule::field_type => r#type = Some(parse_field_type(current)?),
      Rule::LEGACY_COLON => {
        return Err(SchemaError::new_legacy_parser_error(
          "Field declarations don't require a `:`.",
          current.as_span().into(),
        ))
      }
      Rule::field_attribute => attributes.push(parse_attribute(current, diagnostics)),
      Rule::trailing_comment => {
        if let Some(res) = parse_trailing_comment(current) {
          comments.push(res);
        }
      }
      _ => parsing_catch_all(&current, "field"),
    }
  }

  match (id, r#type) {
    (Some(id), Some((is_optional, is_array, r#type))) => {
      Ok(FieldAst { r#type, id, is_optional, is_array, attributes, comments })
    }
    (Some(id), _) => Err(SchemaError::new_model_validation_error(
      "This field declaration is invalid. It is missing a type.",
      container_type,
      id.as_str(),
      pair_span.into(),
    )),
    _ => Err(SchemaError::new_model_validation_error(
      "This field declaration is invalid. It is either missing a name or a type.",
      container_type,
      "Unknown Name",
      pair_span.into(),
    )),
  }
}

pub fn parse_field_type(pair: Pair<'_>) -> Result<(bool, bool, FieldTypeAst), SchemaError> {
  assert!(pair.as_rule() == Rule::field_type);
  let current = pair.into_inner().next().unwrap();
  match current.as_rule() {
    Rule::optional_type => Ok((
      true,
      false,
      FieldTypeAst::from_str(current.into_inner().next().unwrap().as_str()).unwrap(),
    )),
    Rule::base_type => Ok((
      false,
      false,
      FieldTypeAst::from_str(current.into_inner().next().unwrap().as_str()).unwrap(),
    )),
    Rule::list_type => Ok((
      false,
      true,
      FieldTypeAst::from_str(current.into_inner().next().unwrap().as_str()).unwrap(),
    )),
    Rule::legacy_required_type => Err(SchemaError::new_legacy_parser_error(
      "Fields are required by default, `!` is no longer required.",
      current.as_span().into(),
    )),
    Rule::legacy_list_type => Err(SchemaError::new_legacy_parser_error(
      "To specify a list, please use `Type[]` instead of `[Type]`.",
      current.as_span().into(),
    )),
    Rule::unsupported_optional_list_type => Err(SchemaError::new_legacy_parser_error(
      "Optional lists are not supported. Use either `Type[]` or `Type?`.",
      current.as_span().into(),
    )),
    _ => unreachable!("Encountered impossible field during parsing: {:?}", current.tokens()),
  }
}
