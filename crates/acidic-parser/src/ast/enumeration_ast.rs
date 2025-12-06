use super::attribute_ast::AttributeAst;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// An enum declaration. Enumeration can either be in the database schema, or completely a Prisma level concept.
///
/// PostgreSQL stores enums in a schema, while in MySQL the information is in
/// the table definition. On MongoDB the enumerations are handled in the Query
/// Engine.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EnumerationAst {
  /// The identifier of the enum.
  ///
  /// ```ignore
  /// enum Foo { ... }
  ///      ^^^
  /// ```
  pub id: String,

  /// The values of the enum.
  ///
  /// ```ignore
  /// enum Foo {
  ///   Value1
  ///   ^^^^^^
  ///   Value2
  ///   ^^^^^^
  /// }
  /// ```
  pub values: IndexMap<String, EnumerationValueAst>,

  /// The attributes of this enum.
  ///
  /// ```ignore
  /// enum Foo {
  ///   Value1
  ///   Value2
  ///
  ///   @@map("1Foo")
  ///   ^^^^^^^^^^^^^
  /// }
  /// ```
  pub attributes: Vec<AttributeAst>,

  /// The comments for this enum.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// enum Foo {
  ///   Value1
  ///   Value2
  /// }
  /// ```
  pub comments: Vec<String>,
}

impl EnumerationAst {
  pub fn find_value(&self, id: &str) -> Option<&EnumerationValueAst> {
    match self.values.contains_key(id) {
      true => self.values.get(id),
      false => None,
    }
  }
}

/// An enum value definition.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EnumerationValueAst {
  /// The identifier of the enum value.
  ///
  /// ```ignore
  /// Value,
  /// ^^^^^
  /// ```
  pub id: String,

  /// The attributes of this enum value.
  ///
  /// ```ignore
  /// Value @map("1Foo")
  ///       ^^^^^^^^^^^^
  /// ```
  pub attributes: Vec<AttributeAst>,

  /// The attributes of this enum value.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///    ^^^^^^^^^^^
  /// Value @map("1Foo")
  /// ```
  pub comments: Vec<String>,
}
