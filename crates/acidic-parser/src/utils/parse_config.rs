use super::parse_expression::parse_expression;
use crate::ast::expression_ast::ExpressionAst;
use crate::parser::Rule;
use crate::utils::helpers::Pair;
use acidic_diagnostics::Diagnostics;

pub(crate) fn parse_key_value(
  pair: Pair<'_>,
  diagnostics: &mut Diagnostics,
) -> (String, Option<ExpressionAst>) {
  let mut identifier: Option<String> = None;
  let mut value: Option<ExpressionAst> = None;
  let pair_str = pair.as_str();

  for current in pair.into_inner() {
    match current.as_rule() {
      Rule::identifier => identifier = Some(current.as_str().to_owned()),
      Rule::expression => value = Some(parse_expression(current, diagnostics)),
      Rule::trailing_comment => (),
      _ => unreachable!(
        "Encountered impossible source property declaration during parsing: {:?}",
        current.tokens()
      ),
    }
  }

  match (identifier, value) {
    (Some(identifier), value) => (identifier, value),
    _ => unreachable!(
      "Encountered impossible source property declaration during parsing: {:?}",
      pair_str,
    ),
  }
}
