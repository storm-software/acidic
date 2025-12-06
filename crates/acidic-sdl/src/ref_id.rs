use super::traits::WithKind;
use crate::types::NodeKind;
use serde::{Deserialize, Serialize};

/// An Acidic schema node ReferenceId.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct RefId {
  /// The schema identifier.
  pub schema_name: String,

  /// The parent node name.
  pub parent_name: Option<String>,

  /// The node name.
  pub name: String,

  /// The kind of the schema node.
  pub kind: NodeKind,
}

impl RefId {
  /// Create a new RefId.
  pub fn new(
    schema_name: String,
    parent_name: Option<String>,
    name: String,
    kind: NodeKind,
  ) -> Self {
    Self { schema_name, parent_name, name, kind }
  }

  /// Create a new RefId with a parent name.
  pub fn new_with_parent(
    schema_name: String,
    parent_name: String,
    name: String,
    kind: NodeKind,
  ) -> Self {
    Self { schema_name, parent_name: Some(parent_name), name, kind }
  }

  /// Create a new RefId with a parent name.
  pub fn new_without_parent(schema_name: String, name: String, kind: NodeKind) -> Self {
    Self { schema_name, parent_name: None, name, kind }
  }
}

impl WithKind for RefId {
  fn kind(&self) -> &NodeKind {
    &self.kind
  }
}
