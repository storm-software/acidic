use super::parse_arguments::parse_arguments_list;
use crate::ast::argument_ast::ArgumentAst;
use crate::ast::attribute_ast::AttributeAst;
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};

pub(crate) fn parse_attribute(
  pair: Pair<'_>,
  diagnostics: &mut acidic_diagnostics::Diagnostics,
) -> AttributeAst {
  let mut id = None;
  let mut arguments: Vec<ArgumentAst> = Vec::new();

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::path => id = Some(current.to_string()),
      Rule::arguments_list => parse_arguments_list(current, &mut arguments, diagnostics),
      _ => parsing_catch_all(&current, "attribute"),
    }
  }

  let id = id.unwrap();
  AttributeAst { id, arguments }
}
