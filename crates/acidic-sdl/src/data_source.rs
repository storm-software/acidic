use crate::{
  attribute::Attribute,
  ref_id::RefId,
  traits::{WithKind, WithRefId},
  types::NodeKind,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// a `datasource` from the schema.
#[derive(Serialize, Deserialize, Clone)]
pub struct DataSource {
  /// The unique identifier of the data source.
  pub name: String,

  /// The provider string
  pub provider: String,

  pub url: String,

  pub direct_url: Option<String>,

  /// An optional user-defined shadow database URL.
  pub shadow_database_url: Option<String>,

  pub comments: Vec<String>,

  pub attributes: Vec<Attribute>,

  /// _Sorted_ vec of schemas defined in the schemas property.
  pub namespaces: Vec<String>,

  pub properties: HashMap<String, ConfigProperty>,
}

impl std::fmt::Debug for DataSource {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.debug_struct("DataSource")
      .field("name", &self.name)
      .field("provider", &self.provider)
      .field("url", &"<url>")
      .field("comments", &self.comments)
      .field("active_connector", &&"...")
      .field("shadow_database_url", &"<shadow_database_url>")
      .field("namespaces", &self.namespaces)
      .finish()
  }
}

impl DataSource {
  /// Validation for property existence
  pub fn provider_defined(&self) -> bool {
    !self.provider.is_empty()
  }

  pub fn direct_url_defined(&self) -> bool {
    self.direct_url.is_some()
  }

  pub fn shadow_url_defined(&self) -> bool {
    self.shadow_database_url.is_some()
  }
}

impl WithKind for DataSource {
  fn kind(&self) -> &NodeKind {
    &NodeKind::DateSource
  }
}

impl WithRefId for DataSource {
  fn ref_id(&self) -> RefId {
    RefId { kind: self.kind().clone(), name: self.name.clone() }
  }
}
