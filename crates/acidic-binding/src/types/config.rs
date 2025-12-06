use super::expression::{from_expression, into_expression, JsExpression};
use acidic_sdl::{core::config::ConfigProperty, definitions::schema::Schema};

/// A named property in a config block.
///
/// ```ignore
/// datasource db {
///     url = env("URL")
///     ^^^^^^^^^^^^^^^^
/// }
/// ```
#[napi(object, js_name = "ConfigProperty")]
pub struct JsConfigProperty {
  /// The property name.
  ///
  /// ```ignore
  /// datasource db {
  ///     url = env("URL")
  ///     ^^^
  /// }
  /// ```
  ///
  pub identifier: String,

  /// The property value.
  ///
  /// ```ignore
  /// datasource db {
  ///     url = env("URL")
  ///           ^^^^^^^^^^
  /// }
  /// ```
  #[napi(ts_type = "Expression")]
  pub value: Option<JsExpression>,
}

pub(crate) fn from_config_property(property: &ConfigProperty, schema: &Schema) -> JsConfigProperty {
  JsConfigProperty {
    identifier: property.identifier.clone(),
    value: property.value.as_ref().map(|exp| from_expression(exp, schema)),
  }
}

pub(crate) fn into_config_property(property: &JsConfigProperty) -> ConfigProperty {
  ConfigProperty {
    identifier: property.identifier.clone(),
    value: property.value.as_ref().map(|exp| into_expression(exp)),
  }
}
