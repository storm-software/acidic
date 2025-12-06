use serde::{Deserialize, Serialize};

/// An Acidic schema node ReferenceId.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct ReferenceId {
  /// The node contents.
  pub identifier: String,

  /// The kind of the schema node.
  pub kind: NodeKind,
}

/// An enum representing the different kinds of nodes in the Acidic schema.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum NodeKind {
  Model,
  Definition,
  Enumeration,
  EnumerationValue,
  Field,
  Event,
  Query,
  Mutation,
  Subscription,
  Plugin,
  DateSource,
  Schema,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct SchemaFile {
  pub path: String,
  pub text: String,
  pub version: i32,
}
