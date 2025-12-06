use super::argument::{from_argument, into_argument, JsArgument};
use acidic_sdl::{core::attribute::Attribute, definitions::schema::Schema};

/// An attribute (following `@` or `@@``) on a model, model field, enum, enum value or composite
/// type field.
#[napi(object, js_name = "Attribute")]
pub struct JsAttribute {
  /// The name of the attribute:
  ///
  /// ```ignore
  /// @@index([a, b, c])
  ///   ^^^^^
  /// ```
  pub identifier: String,

  /// The arguments of the attribute.
  ///
  /// ```ignore
  /// @@index([a, b, c], map: "myidix")
  ///         ^^^^^^^^^^^^^^^^^^^^^^^^
  /// ```
  #[napi(ts_type = "Argument")]
  pub arguments: Vec<JsArgument>,
}

pub(crate) fn from_attribute(attribute: &Attribute, schema: &Schema) -> JsAttribute {
  JsAttribute {
    identifier: attribute.identifier.clone(),
    arguments: attribute.arguments.iter().map(|arg| from_argument(arg, schema)).collect(),
  }
}

pub(crate) fn into_attribute(js_attribute: &JsAttribute) -> Attribute {
  Attribute {
    identifier: js_attribute.identifier.clone(),
    arguments: js_attribute.arguments.iter().map(|arg| into_argument(arg)).collect(),
  }
}
