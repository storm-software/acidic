use super::field::Field;
use crate::{
  attribute::Attribute,
  ref_id::RefId,
  traits::{WithIdentifier, WithKind, WithReferenceId},
  types::NodeKind,
};
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

/// A Definition declaration.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Definition {
  /// The name of the Definition.
  ///
  /// ```ignore
  /// type Foo { .. }
  ///       ^^^
  /// ```
  pub name: String,

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
  pub fields: HashMap<String, Field>,

  /**
  The attributes of this model.

  ```ignore
  type Foo {
    id    Int    @id
    field String

    @@index([field])
    ^^^^^^^^^^^^^^^^
    @@map("Bar")
    ^^^^^^^^^^^^
  }
  ```
  */
  pub attributes: Vec<Attribute>,

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
}

impl Definition {
  pub fn find_field(&self, name: &str) -> Option<&Field> {
    match self.fields.contains_key(name) {
      true => self.fields.get(name),
      false => None,
    }
  }
}

impl WithKind for Definition {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Definition
  }
}
