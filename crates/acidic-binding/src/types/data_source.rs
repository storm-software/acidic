use super::{
  attribute::{from_attribute, into_attribute, JsAttribute},
  config::{from_config_property, into_config_property, JsConfigProperty},
};
use acidic_sdl::definitions::{data_source::DataSource, schema::Schema};
use std::collections::HashMap;

/// a `datasource` from the schema.
#[napi(object, js_name = "DataSource")]
pub struct JsDataSource {
  pub identifier: String,

  /// The provider string
  pub provider: String,

  pub url: String,

  pub direct_url: Option<String>,

  /// An optional user-defined shadow database URL.
  pub shadow_database_url: Option<String>,

  pub comments: Vec<String>,

  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,

  /// _Sorted_ vec of schemas defined in the schemas property.
  pub namespaces: Vec<String>,

  #[napi(ts_type = "Record<string, ConfigProperty>")]
  pub properties: HashMap<String, JsConfigProperty>,
}

pub(crate) fn from_data_source(datasource: &DataSource, schema: &Schema) -> JsDataSource {
  JsDataSource {
    identifier: datasource.identifier.clone(),
    provider: datasource.provider.clone(),
    url: datasource.url.clone(),
    direct_url: datasource.direct_url.clone(),
    shadow_database_url: datasource.shadow_database_url.clone(),
    comments: datasource.comments.clone(),
    attributes: datasource.attributes.iter().map(|attr| from_attribute(attr, schema)).collect(),
    namespaces: datasource.namespaces.clone(),
    properties: datasource
      .properties
      .iter()
      .map(|(k, v)| (k.clone(), from_config_property(v, schema)))
      .collect(),
  }
}

pub(crate) fn into_data_source(js_datasource: &JsDataSource) -> DataSource {
  DataSource {
    identifier: js_datasource.identifier.clone(),
    provider: js_datasource.provider.clone(),
    url: js_datasource.url.clone(),
    direct_url: js_datasource.direct_url.clone(),
    shadow_database_url: js_datasource.shadow_database_url.clone(),
    comments: js_datasource.comments.clone(),
    attributes: js_datasource.attributes.iter().map(|attr| into_attribute(attr)).collect(),
    namespaces: js_datasource.namespaces.clone(),
    properties: js_datasource
      .properties
      .iter()
      .map(|(k, v)| (k.clone(), into_config_property(v)))
      .collect(),
  }
}
