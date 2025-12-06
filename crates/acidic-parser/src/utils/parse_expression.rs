use super::parse_arguments::parse_arguments_list;
use super::string_literal::parse_string_literal;
use crate::ast::argument_ast::ArgumentAst;
use crate::ast::expression_ast::ExpressionAst;
use crate::parser::Rule;
use crate::utils::helpers::{parsing_catch_all, Pair};
use acidic_diagnostics::Diagnostics;

pub(crate) fn parse_expression(
  token: Pair<'_>,
  diagnostics: &mut acidic_diagnostics::Diagnostics,
) -> ExpressionAst {
  let first_child = token.into_inner().next().unwrap();

  match first_child.as_rule() {
    Rule::numeric_literal => ExpressionAst::NumericValue(first_child.as_str().to_string()),
    Rule::string_literal => {
      ExpressionAst::StringValue(parse_string_literal(first_child, diagnostics))
    }
    Rule::path => ExpressionAst::LiteralValue(first_child.as_str().to_string()),
    Rule::function_call => {
      let result = parse_function(first_child, diagnostics);

      ExpressionAst::FunctionValue(result.0, result.1)
    }
    Rule::array_expression => ExpressionAst::ArrayValue(parse_array(first_child, diagnostics)),
    _ => unreachable!("Encountered impossible literal during parsing: {:?}", first_child.tokens()),
  }
}

fn parse_function(pair: Pair<'_>, diagnostics: &mut Diagnostics) -> (String, Vec<ArgumentAst>) {
  let mut identifier: Option<String> = None;
  let mut arguments: Vec<ArgumentAst> = Vec::new();
  let pair_str = pair.as_str();

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::path => identifier = Some(current.to_string()),
      Rule::arguments_list => parse_arguments_list(current, &mut arguments, diagnostics),
      _ => parsing_catch_all(&current, "function"),
    }
  }

  match identifier {
    Some(identifier) => (identifier, arguments),
    _ => unreachable!("Encountered impossible function during parsing: {:?}", pair_str),
  }
}

fn parse_array(token: Pair<'_>, diagnostics: &mut Diagnostics) -> Vec<ExpressionAst> {
  let mut elements: Vec<ExpressionAst> = vec![];

  for current in token.into_inner() {
    match current.as_rule() {
      Rule::expression => elements.push(parse_expression(current, diagnostics)),
      _ => parsing_catch_all(&current, "array"),
    }
  }

  elements
}
