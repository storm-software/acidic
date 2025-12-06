use crate::{
  attribute::Attribute,
  ref_id::RefId,
  types::{NameValuePair, NodeKind},
};

/// An schema node with a node type.
pub trait WithKind {
  /// The type of the schema node.
  fn kind(&self) -> &NodeKind;
}

pub trait WithIdentifier {
  /// The identifier of the schema node.
  fn identifier(&self) -> &str;
}

/// An schema node with an identifier.
pub trait WithRefId {
  /// The identifier.
  fn ref_id(&self) -> RefId;
}

/// An schema node with attributes.
pub trait WithAttributes {
  /// The attributes.
  fn attributes(&self) -> &[Attribute];
}

/// An schema node with comments.
pub trait WithComments {
  /// The comment string, if defined.
  fn comments(&self) -> String;
}

pub trait WithProperties {
  fn properties(&self) -> Vec<NameValuePair>;
}
