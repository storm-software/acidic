use crate::types::{
  attribute::{from_attribute, into_attribute, JsAttribute},
  data_source::{from_data_source, into_data_source, JsDataSource},
  definition::{from_definition, into_definition, JsDefinition},
  enumeration::{from_enumeration, into_enumeration, JsEnumeration},
  model::{from_model, into_model, JsModel},
  plugin::{from_plugin, into_plugin, JsPlugin},
};
use acidic_sdl::definitions::schema::Schema;
use std::collections::HashMap;

#[napi(object, js_name = "Schema")]
pub struct JsSchema {
  pub identifier: Option<String>,
  #[napi(ts_type = "Record<string, Model>")]
  pub models: HashMap<String, JsModel>,
  #[napi(ts_type = "Record<string, Definition>")]
  pub definitions: HashMap<String, JsDefinition>,
  #[napi(ts_type = "Record<string, DataSource>")]
  pub data_sources: HashMap<String, JsDataSource>,
  #[napi(ts_type = "Record<string, Plugin>")]
  pub plugins: HashMap<String, JsPlugin>,
  #[napi(ts_type = "Record<string, Enumeration>")]
  pub enumerations: HashMap<String, JsEnumeration>,
  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,
  pub comments: Vec<String>,
}

pub fn from_schema(schema: &Schema) -> JsSchema {
  JsSchema {
    identifier: schema.identifier.clone(),
    models: schema.models.iter().map(|(k, v)| (k.clone(), from_model(v, schema))).collect(),
    definitions: schema
      .definitions
      .iter()
      .map(|(k, v)| (k.clone(), from_definition(v, schema)))
      .collect(),
    data_sources: schema
      .data_sources
      .iter()
      .map(|(k, v)| (k.clone(), from_data_source(v, schema)))
      .collect(),
    plugins: schema.plugins.iter().map(|(k, v)| (k.clone(), from_plugin(v, schema))).collect(),
    enumerations: schema
      .enumerations
      .iter()
      .map(|(k, v)| (k.clone(), from_enumeration(v, schema)))
      .collect(),
    attributes: schema.attributes.iter().map(|a| from_attribute(a, schema)).collect(),
    comments: schema.comments.clone(),
  }
}

pub fn into_schema(js_schema: &JsSchema) -> Schema {
  Schema {
    identifier: js_schema.identifier.clone(),
    models: js_schema.models.iter().map(|(k, v)| (k.clone(), into_model(v))).collect(),
    definitions: js_schema
      .definitions
      .iter()
      .map(|(k, v)| (k.clone(), into_definition(v)))
      .collect(),
    data_sources: js_schema
      .data_sources
      .iter()
      .map(|(k, v)| (k.clone(), into_data_source(v)))
      .collect(),
    plugins: js_schema.plugins.iter().map(|(k, v)| (k.clone(), into_plugin(v))).collect(),
    enumerations: js_schema
      .enumerations
      .iter()
      .map(|(k, v)| (k.clone(), into_enumeration(v)))
      .collect(),
    attributes: js_schema.attributes.iter().map(|a| into_attribute(a)).collect(),
    comments: js_schema.comments.clone(),
  }
}
