use super::attribute::{from_attribute, into_attribute, JsAttribute};
use acidic_sdl::definitions::{
  enumeration::{Enumeration, EnumerationValue},
  schema::Schema,
};
use std::collections::HashMap;

/// An enum declaration. Enumeration can either be in the database schema, or completely a Prisma level concept.
///
/// PostgreSQL stores enums in a schema, while in MySQL the information is in
/// the table definition. On MongoDB the enumerations are handled in the Query
/// Engine.
#[napi(object, js_name = "Enumeration")]
pub struct JsEnumeration {
  /// The identifier of the enum.
  ///
  /// ```ignore
  /// enum Foo { ... }
  ///      ^^^
  /// ```
  pub identifier: String,

  /// The values of the enum.
  ///
  /// ```ignore
  /// enum Foo {
  ///   Value1
  ///   ^^^^^^
  ///   Value2
  ///   ^^^^^^
  /// }
  /// ```
  #[napi(ts_type = "Record<string, EnumerationValue>")]
  pub values: HashMap<String, JsEnumerationValue>,

  /// The attributes of this enum.
  ///
  /// ```ignore
  /// enum Foo {
  ///   Value1
  ///   Value2
  ///
  ///   @@map("1Foo")
  ///   ^^^^^^^^^^^^^
  /// }
  /// ```
  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,

  /// The comments for this enum.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// enum Foo {
  ///   Value1
  ///   Value2
  /// }
  /// ```
  pub comments: Vec<String>,
}

/// An enum value definition.
#[napi(object, js_name = "EnumerationValue")]
pub struct JsEnumerationValue {
  /// The name of the enum value as it will be exposed by the api.
  pub identifier: String,
  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,
  pub comments: Vec<String>,
}

pub(crate) fn from_enumeration(enumeration: &Enumeration, schema: &Schema) -> JsEnumeration {
  JsEnumeration {
    identifier: enumeration.identifier.clone(),
    values: enumeration
      .values
      .iter()
      .map(|(k, v)| (k.clone(), from_enumeration_value(v, schema)))
      .collect(),
    attributes: enumeration.attributes.iter().map(|a| from_attribute(a, schema)).collect(),
    comments: enumeration.comments.clone(),
  }
}

fn from_enumeration_value(value: &EnumerationValue, schema: &Schema) -> JsEnumerationValue {
  JsEnumerationValue {
    identifier: value.identifier.clone(),
    attributes: value.attributes.iter().map(|a| from_attribute(a, schema)).collect(),
    comments: value.comments.clone(),
  }
}

pub(crate) fn into_enumeration(js_enumeration: &JsEnumeration) -> Enumeration {
  Enumeration {
    identifier: js_enumeration.identifier.clone(),
    values: js_enumeration
      .values
      .iter()
      .map(|(k, v)| (k.clone(), into_enumeration_value(v)))
      .collect(),
    attributes: js_enumeration.attributes.iter().map(|a| into_attribute(a)).collect(),
    comments: js_enumeration.comments.clone(),
  }
}

fn into_enumeration_value(js_value: &JsEnumerationValue) -> EnumerationValue {
  EnumerationValue {
    identifier: js_value.identifier.clone(),
    attributes: js_value.attributes.iter().map(|a| into_attribute(a)).collect(),
    comments: js_value.comments.clone(),
  }
}
