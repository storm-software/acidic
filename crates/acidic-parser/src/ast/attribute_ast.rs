use super::argument_ast::ArgumentAst;
use serde::{Deserialize, Serialize};

/// An attribute (following `@` or `@@``) on a model, model field, enum, enum value or composite
/// type field.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct AttributeAst {
  /// The name of the attribute:
  ///
  /// ```ignore
  /// @@index([a, b, c])
  ///   ^^^^^
  /// ```
  pub id: String,

  /// The arguments of the attribute.
  ///
  /// ```ignore
  /// @@index([a, b, c], map: "myidix")
  ///         ^^^^^^^^^^^^^^^^^^^^^^^^
  /// ```
  pub arguments: Vec<ArgumentAst>,
}
