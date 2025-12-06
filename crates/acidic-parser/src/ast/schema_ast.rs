use std::collections::HashMap;

use super::{
  attribute_ast::AttributeAst, config_ast::ConfigAst, definition_ast::DefinitionAst,
  enumeration_ast::EnumerationAst, model_ast::ModelAst,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SchemaAst {
  pub id: Option<String>,
  pub imports: Vec<ImportAst>,
  pub models: HashMap<String, ModelAst>,
  pub definitions: HashMap<String, DefinitionAst>,
  pub data_sources: HashMap<String, ConfigAst>,
  pub plugins: HashMap<String, ConfigAst>,
  pub enumerations: HashMap<String, EnumerationAst>,
  pub attributes: Vec<AttributeAst>,
  pub comments: Vec<String>,
}

impl SchemaAst {
  pub fn find_definition(&self, id: &str) -> Option<&DefinitionAst> {
    match self.definitions.contains_key(id) {
      true => self.definitions.get(id),
      false => None,
    }
  }

  pub fn find_model(&self, id: &str) -> Option<&ModelAst> {
    match self.models.contains_key(id) {
      true => self.models.get(id),
      false => None,
    }
  }

  pub fn find_enumeration(&self, id: &str) -> Option<&EnumerationAst> {
    match self.enumerations.contains_key(id) {
      true => self.enumerations.get(id),
      false => None,
    }
  }

  pub fn find_data_source(&self, id: &str) -> Option<&ConfigAst> {
    match self.data_sources.contains_key(id) {
      true => self.data_sources.get(id),
      false => None,
    }
  }

  pub fn find_plugin(&self, id: &str) -> Option<&ConfigAst> {
    match self.plugins.contains_key(id) {
      true => self.plugins.get(id),
      false => None,
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ImportAst {
  pub id: Option<String>,
  pub path: String,
  pub comments: Vec<String>,
}
