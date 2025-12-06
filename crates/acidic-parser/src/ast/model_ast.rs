use super::attribute_ast::AttributeAst;
use serde::{Deserialize, Serialize};

/// A model declaration.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ModelAst {
  /// The name of the model.
  ///
  /// ```ignore
  /// model Foo { .. }
  ///       ^^^
  /// ```
  pub id: String,

  /// The attributes of this model.
  ///
  /// ```ignore
  /// model Foo {
  ///   id    Int    @id
  ///  field String
  ///
  ///  @@index([field])
  ///  ^^^^^^^^^^^^^^^^
  ///  @@map("Bar")
  /// ^^^^^^^^^^^^
  /// }
  /// ```
  pub attributes: Vec<AttributeAst>,

  /// The documentation for this model.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// model Foo {
  ///   id    Int    @id
  ///   field String
  /// }
  /// ```
  pub comments: Vec<String>,

  /// Is the model defined as a view in the database.
  ///
  /// ```ignore
  /// view Foo {
  ///   val Int @unique
  /// }
  /// ```
  pub is_view: bool,
}
