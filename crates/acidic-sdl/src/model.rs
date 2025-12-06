use std::collections::HashMap;

use super::field::Field;
use crate::core::{
  attribute::Attribute,
  reference_id::ReferenceId,
  traits::{WithIdentifier, WithKind, WithReferenceId},
  types::NodeKind,
};
use serde::{Deserialize, Serialize};

/// A model declaration.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Model {
  /// The name of the model.
  ///
  /// ```ignore
  /// model Foo { .. }
  ///       ^^^
  /// ```
  pub name: String,

  /// The fields of the model.
  ///
  /// ```ignore
  /// model Foo {
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
  model Foo {
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

  /// Is the model defined as a view in the database.
  ///
  /// ```ignore
  /// view Foo {
  ///   val Int @unique
  /// }
  /// ```
  pub is_view: bool,
}

impl Model {
  pub fn is_view(&self) -> bool {
    self.is_view
  }

  pub fn find_field(&self, name: &str) -> Option<&Field> {
    match self.fields.contains_key(name) {
      true => self.fields.get(name),
      false => None,
    }
  }
}

impl WithKind for Model {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Model
  }
}

impl WithReferenceId for Model {
  fn reference_id(&self) -> ReferenceId {
    ReferenceId { kind: self.kind().clone(), identifier: self.identifier.clone() }
  }
}
