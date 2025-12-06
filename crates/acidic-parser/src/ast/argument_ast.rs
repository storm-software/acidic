use super::expression_ast::ExpressionAst;
use serde::{Deserialize, Serialize};

/// An argument, either for attributes or for function call expressions.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct ArgumentAst {
  /// The argument identifier, if applicable.
  ///
  /// ```ignore
  /// @id(map: "myIndex")
  ///     ^^^
  /// ```
  pub id: Option<String>,

  /// The argument value.
  ///
  /// ```ignore
  /// @id("myIndex")
  ///     ^^^^^^^^^
  /// ```
  pub value: ExpressionAst,

  /// The argument default value.
  ///
  /// ```ignore
  /// @id(map: String = "myIndex")
  ///                   ^^^^^^^^^
  /// ```
  pub default: Option<ExpressionAst>,
}

impl ArgumentAst {
  pub fn is_unnamed(&self) -> bool {
    self.id.is_none()
  }
}
