use std::collections::HashMap;

use crate::core::traits::{WithAttributes, WithIdentifier, WithKind, WithReferenceId};
use crate::core::{attribute::Attribute, reference_id::ReferenceId, types::NodeKind};
use serde::{Deserialize, Serialize};

/// An enum declaration. Enumeration can either be in the database schema, or completely a Prisma level concept.
///
/// PostgreSQL stores enums in a schema, while in MySQL the information is in
/// the table definition. On MongoDB the enumerations are handled in the Query
/// Engine.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Enumeration {
  /// The name of the enum.
  ///
  /// ```ignore
  /// enum Foo { ... }
  ///      ^^^
  /// ```
  pub name: String,

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
  pub values: HashMap<String, EnumerationValue>,

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
  pub attributes: Vec<Attribute>,

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

impl Enumeration {
  pub fn find_value(&self, name: &str) -> Option<&EnumerationValue> {
    match self.values.contains_key(name) {
      true => self.values.get(name),
      false => None,
    }
  }
}

impl WithKind for Enumeration {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Enumeration
  }
}

impl WithAttributes for Enumeration {
  fn attributes(&self) -> &[Attribute] {
    &self.attributes
  }
}

/// An enum value definition.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EnumerationValue {
  /// The name of the enum value as it will be exposed by the api.
  pub name: String,
  pub attributes: Vec<Attribute>,
  pub comments: Vec<String>,
}

impl WithKind for EnumerationValue {
  fn kind(&self) -> &NodeKind {
    &NodeKind::EnumerationValue
  }
}

impl WithAttributes for EnumerationValue {
  fn attributes(&self) -> &[Attribute] {
    &self.attributes
  }
}
