use super::{
  attribute::{from_attribute, into_attribute, JsAttribute},
  config::{from_config_property, into_config_property, JsConfigProperty},
};
use acidic_sdl::definitions::{plugin::Plugin, schema::Schema};
use std::collections::HashMap;

/// a `datasource` from the schema.
#[napi(object, js_name = "Plugin")]
pub struct JsPlugin {
  pub identifier: String,

  /// The provider string
  pub provider: String,

  pub output: Option<String>,

  pub comments: Vec<String>,

  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,

  #[napi(ts_type = "Record<string, ConfigProperty>")]
  pub properties: HashMap<String, JsConfigProperty>,
}

pub(crate) fn from_plugin(plugin: &Plugin, schema: &Schema) -> JsPlugin {
  JsPlugin {
    identifier: plugin.identifier.clone(),
    provider: plugin.provider.clone(),
    output: plugin.output.clone(),
    comments: plugin.comments.clone(),
    attributes: plugin.attributes.iter().map(|a| from_attribute(a, schema)).collect(),
    properties: plugin
      .properties
      .iter()
      .map(|(k, v)| (k.clone(), from_config_property(v, schema)))
      .collect(),
  }
}

pub(crate) fn into_plugin(js_plugin: &JsPlugin) -> Plugin {
  Plugin {
    identifier: js_plugin.identifier.clone(),
    provider: js_plugin.provider.clone(),
    output: js_plugin.output.clone(),
    comments: js_plugin.comments.clone(),
    attributes: js_plugin.attributes.iter().map(|a| into_attribute(a)).collect(),
    properties: js_plugin
      .properties
      .iter()
      .map(|(k, v)| (k.clone(), into_config_property(v)))
      .collect(),
  }
}
