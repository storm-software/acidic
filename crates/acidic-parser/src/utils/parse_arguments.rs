use super::parse_expression::parse_expression;
use crate::ast::argument_ast::ArgumentAst;
use crate::ast::expression_ast::ExpressionAst;
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::Diagnostics;

pub(crate) fn parse_arguments_list(
  token: Pair<'_>,
  arguments: &mut Vec<ArgumentAst>,
  diagnostics: &mut Diagnostics,
) {
  debug_assert_eq!(token.as_rule(), Rule::arguments_list);
  for current in token.into_inner() {
    match current.as_rule() {
      // This is a defaulted arg.
      Rule::defaulted_argument => arguments.push(parse_defaulted_arg(current, diagnostics)),
      // This is a named arg.
      Rule::named_argument => arguments.push(parse_named_arg(current, diagnostics)),
      // This is an unnamed arg.
      Rule::expression => arguments.push(ArgumentAst {
        id: None,
        value: parse_expression(current, diagnostics),
        default: None,
      }),
      _ => parsing_catch_all(&current, "attribute arguments"),
    }
  }
}

fn parse_named_arg(pair: Pair<'_>, diagnostics: &mut Diagnostics) -> ArgumentAst {
  debug_assert_eq!(pair.as_rule(), Rule::named_argument);
  let mut identifier: Option<String> = None;
  let mut argument: Option<ExpressionAst> = None;
  let pair_str = pair.as_str();

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::identifier => identifier = Some(current.as_str().to_owned().into()),
      Rule::expression => argument = Some(parse_expression(current, diagnostics)),

      _ => parsing_catch_all(&current, "attribute argument"),
    }
  }

  match (identifier, argument) {
    (Some(identifier), Some(value)) => ArgumentAst { id: Some(identifier), value, default: None },
    _ => panic!("Encountered impossible attribute arg during parsing: {pair_str:?}"),
  }
}

fn parse_defaulted_arg(pair: Pair<'_>, diagnostics: &mut Diagnostics) -> ArgumentAst {
  debug_assert_eq!(pair.as_rule(), Rule::named_argument);
  let mut identifier: Option<String> = None;
  let mut argument: Option<ExpressionAst> = None;
  let mut default: Option<ExpressionAst> = None;
  let pair_str = pair.as_str();

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::identifier => identifier = Some(current.as_str().to_owned().into()),
      Rule::expression => {
        if argument.is_none() {
          argument = Some(parse_expression(current, diagnostics))
        } else {
          default = Some(parse_expression(current, diagnostics))
        }
      }

      _ => parsing_catch_all(&current, "attribute argument"),
    }
  }

  match (identifier, argument) {
    (Some(identifier), Some(value)) => ArgumentAst { id: Some(identifier), value, default },
    _ => panic!("Encountered impossible attribute arg during parsing: {pair_str:?}"),
  }
}
