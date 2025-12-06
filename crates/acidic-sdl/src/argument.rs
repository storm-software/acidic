use super::expression::Expression;
use serde::{Deserialize, Serialize};

/// An argument, either for attributes or for function call expressions.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Argument {
  /// The argument identifier, if applicable.
  ///
  /// ```ignore
  /// @id(map: "myIndex")
  ///     ^^^
  /// ```
  pub name: Option<String>,

  /// The argument value.
  ///
  /// ```ignore
  /// @id("myIndex")
  ///     ^^^^^^^^^
  /// ```
  pub value: Expression,

  /// The argument default value.
  ///
  /// ```ignore
  /// @id(map: String = "myIndex")
  ///                   ^^^^^^^^^
  /// ```
  pub default: Option<Expression>,
}

impl Argument {
  pub fn is_unnamed(&self) -> bool {
    self.name.is_none()
  }
}
