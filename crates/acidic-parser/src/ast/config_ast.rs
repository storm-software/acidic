use super::{attribute_ast::AttributeAst, expression_ast::ExpressionAst};
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ConfigAst {
  /// The type of the Config.
  ///
  /// ```ignore
  /// plugin Foo { .. }
  /// ^^^^^^
  /// ```
  pub keyword: String,

  /// The name of the Config.
  ///
  /// ```ignore
  /// plugin Foo { .. }
  ///       ^^^
  /// ```
  pub id: String,

  /// The documentation for this Config.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// plugin Foo {
  ///   fieldInt    Int    @id
  ///   fieldString String
  /// }
  /// ```
  pub comments: Vec<String>,

  /// The attributes of this Config.
  ///
  /// ```ignore
  /// plugin Foo {
  ///   fieldInt    Int    @id
  ///   fieldString String
  ///
  ///  @@index([fieldInt])
  ///  ^^^^^^^^^^^^^^^^^^^
  /// }
  /// ```
  pub attributes: Vec<AttributeAst>,

  /// The properties of the Config.
  ///
  /// ```ignore
  /// type Foo {
  ///   id    Int    @id
  ///   ^^^^^^^^^^^^^^^^
  ///   field String
  ///   ^^^^^^^^^^^^
  /// }
  /// ```
  pub properties: IndexMap<String, ExpressionAst>,
}

impl ConfigAst {
  pub fn find_property(&self, id: &str) -> Option<&ExpressionAst> {
    match self.properties.contains_key(id) {
      true => self.properties.get(id),
      false => None,
    }
  }
}
