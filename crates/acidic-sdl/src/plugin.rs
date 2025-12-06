use crate::core::{
  attribute::Attribute,
  config::ConfigProperty,
  reference_id::ReferenceId,
  traits::{WithKind, WithReferenceId},
  types::NodeKind,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// a `datasource` from the schema.
#[derive(Serialize, Deserialize, Clone)]
pub struct Plugin {
  pub name: String,

  /// The provider string
  pub provider: String,

  pub output: Option<String>,

  pub comments: Vec<String>,

  pub attributes: Vec<Attribute>,

  pub properties: HashMap<String, ConfigProperty>,
}

impl std::fmt::Debug for Plugin {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.debug_struct("Plugin").field("name", &self.name).field("provider", &self.provider).finish()
  }
}

impl Plugin {
  // Validation for property existence
  pub fn provider_defined(&self) -> bool {
    !self.provider.is_empty()
  }
}

impl WithKind for Plugin {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Plugin
  }
}

impl WithReferenceId for Plugin {
  fn reference_id(&self) -> ReferenceId {
    ReferenceId { kind: self.kind().clone(), name: self.name.clone() }
  }
}
