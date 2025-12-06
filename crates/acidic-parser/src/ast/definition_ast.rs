use super::{attribute_ast::AttributeAst, field_ast::FieldAst};
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// A Definition declaration.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DefinitionAst {
  /// The name of the Definition.
  ///
  /// ```ignore
  /// type Foo { .. }
  ///       ^^^
  /// ```
  pub id: String,

  /// The fields of the Definition.
  ///
  /// ```ignore
  /// type Foo {
  ///   id    Int    @id
  ///   ^^^^^^^^^^^^^^^^
  ///   field String
  ///   ^^^^^^^^^^^^
  /// }
  /// ```
  pub fields: IndexMap<String, FieldAst>,

  /// The attributes of this Definition.
  ///
  /// ```ignore
  /// type Foo {
  ///   fieldInt    Int    @id
  ///   fieldString String
  ///
  ///  @@index([fieldInt])
  ///  ^^^^^^^^^^^^^^^^^^^
  /// }
  /// ```
  pub attributes: Vec<AttributeAst>,

  /// The documentation for this model.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// type Foo {
  ///   id    Int    @id
  ///   field String
  /// }
  /// ```
  pub comments: Vec<String>,
}

impl DefinitionAst {
  pub fn find_field(&self, id: &str) -> Option<&FieldAst> {
    match self.fields.contains_key(id) {
      true => self.fields.get(id),
      false => None,
    }
  }
}
