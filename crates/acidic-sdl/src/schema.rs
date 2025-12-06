use super::{
  data_source::DataSource, definition::Definition, enumeration::Enumeration, model::Model,
  plugin::Plugin,
};
use crate::{
  attribute::Attribute,
  expression::ReferenceExpression,
  ref_id::ReferenceId,
  traits::{WithAttributes, WithKind, WithRefId},
  types::NodeKind,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct Schema {
  pub identifier: Option<String>,
  pub models: HashMap<String, Model>,
  pub definitions: HashMap<String, Definition>,
  pub data_sources: HashMap<String, DataSource>,
  pub plugins: HashMap<String, Plugin>,
  pub enumerations: HashMap<String, Enumeration>,
  pub attributes: Vec<Attribute>,
  pub comments: Vec<String>,
  //   pub events: Vec<Event>,
  //   pub queries: Vec<Query>,
  //   pub mutations: Vec<Mutation>,
  //   pub subscriptions: Vec<Subscription>,
}

impl Schema {
  pub fn find_definition(&self, identifier: &str) -> Option<&Definition> {
    match self.definitions.contains_key(identifier) {
      true => self.definitions.get(identifier),
      false => None,
    }
  }

  pub fn find_model(&self, identifier: &str) -> Option<&Model> {
    match self.models.contains_key(identifier) {
      true => self.models.get(identifier),
      false => None,
    }
  }

  pub fn find_enumeration(&self, identifier: &str) -> Option<&Enumeration> {
    match self.enumerations.contains_key(identifier) {
      true => self.enumerations.get(identifier),
      false => None,
    }
  }

  pub fn find_data_source(&self, identifier: &str) -> Option<&DataSource> {
    match self.data_sources.contains_key(identifier) {
      true => self.data_sources.get(identifier),
      false => None,
    }
  }

  pub fn find_plugin(&self, identifier: &str) -> Option<&Plugin> {
    match self.plugins.contains_key(identifier) {
      true => self.plugins.get(identifier),
      false => None,
    }
  }

  pub fn find_reference_id(&self, reference: &ReferenceExpression) -> Option<ReferenceId> {
    let identifier = &reference.identifier;
    let parent_identifier = &reference.parent_identifier;

    if parent_identifier.is_some() {
      let parent_identifier = &parent_identifier.as_ref().unwrap();
      if let Some(enumeration) = self.find_enumeration(&parent_identifier) {
        if let Some(value) = enumeration.find_value(&identifier) {
          return Some(value.reference_id());
        }
      } else if let Some(definition) = self.find_definition(&parent_identifier) {
        if let Some(field) = definition.find_field(&identifier) {
          return Some(field.reference_id());
        }
      }
    } else {
      if let Some(enumeration) = self.enumerations.iter().find_map(|(_, enumeration)| {
        if let Some(value) = &enumeration.find_value(&identifier) {
          return Some(value.reference_id());
        }
        None
      }) {
        return Some(enumeration);
      } else if let Some(definition) = self.definitions.iter().find_map(|(_, definition)| {
        if let Some(field) = &definition.find_field(&identifier) {
          return Some(field.reference_id());
        }
        None
      }) {
        return Some(definition);
      }
    }

    None
  }

  //   pub fn iter_events(&self) -> impl ExactSizeIterator<Item = (EventId, &Event)> {
  //     self
  //       .events
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, event)| (EventId(idx as u32), event))
  //   }

  //   pub fn iter_queries(&self) -> impl ExactSizeIterator<Item = (QueryId, &Query)> {
  //     self
  //       .queries
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, query)| (QueryId(idx as u32), query))
  //   }

  //   pub fn iter_mutations(&self) -> impl ExactSizeIterator<Item = (MutationId, &Mutation)> {
  //     self
  //       .mutations
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, mutation)| (MutationId(idx as u32), mutation))
  //   }

  //   pub fn iter_subscriptions(
  //     &self,
  //   ) -> impl ExactSizeIterator<Item = (SubscriptionId, &Subscription)> {
  //     self
  //       .subscriptions
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, subscription)| (SubscriptionId(idx as u32), subscription))
  //   }

  //   pub fn iter_plugins(&self) -> impl ExactSizeIterator<Item = (PluginId, &Plugin)> {
  //     self
  //       .plugins
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, plugin)| (PluginId(idx as u32), plugin))
  //   }

  //   pub fn iter_data_sources(&self) -> impl ExactSizeIterator<Item = (DataSourceId, &DataSource)> {
  //     self
  //       .data_sources
  //       .iter()
  //       .enumerate()
  //       .map(|(idx, data_source)| (DataSourceId(idx as u32), data_source))
  //   }
}

impl WithKind for Schema {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Schema
  }
}

impl WithAttributes for Schema {
  fn attributes(&self) -> &[Attribute] {
    &self.attributes
  }
}
