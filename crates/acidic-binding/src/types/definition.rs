use super::{
  attribute::{from_attribute, into_attribute, JsAttribute},
  field::{from_field, into_field, JsField},
};
use acidic_sdl::definitions::{definition::Definition, schema::Schema};
use std::collections::HashMap;

/// A Definition declaration.
#[napi(object, js_name = "Definition")]
pub struct JsDefinition {
  /// The name of the Definition.
  ///
  /// ```ignore
  /// type Foo { .. }
  ///       ^^^
  /// ```
  pub identifier: String,

  /// The fields of the Definition.
  ///
  /// ```ignore
  /// type Foo {
  ///   id    Int    @id
  ///   ^^^^^^^^^^^^^^^^
  ///   field String
  ///   ^^^^^^^^^^^^
  /// }
  /// ```
  #[napi(ts_type = "Record<string, Field>")]
  pub fields: HashMap<String, JsField>,

  /// The attributes of this model.
  ///
  /// ```ignore
  /// type Foo {
  /// id    Int    @id
  /// field String
  ///
  /// @@index([field])
  /// ^^^^^^^^^^^^^^^^
  /// @@map("Bar")
  /// ^^^^^^^^^^^^
  /// }
  /// ```
  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,

  /// The documentation for this model.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// model Foo {
  ///   id    Int    @id
  ///   field String
  /// }
  /// ```
  pub comments: Vec<String>,
}

pub(crate) fn from_definition(definition: &Definition, schema: &Schema) -> JsDefinition {
  JsDefinition {
    identifier: definition.identifier.clone(),
    fields: definition.fields.iter().map(|(k, v)| (k.clone(), from_field(v, schema))).collect(),
    attributes: definition.attributes.iter().map(|attr| from_attribute(attr, schema)).collect(),
    comments: definition.comments.clone(),
  }
}

pub(crate) fn into_definition(js_definition: &JsDefinition) -> Definition {
  Definition {
    identifier: js_definition.identifier.clone(),
    fields: js_definition.fields.iter().map(|(k, v)| (k.clone(), into_field(v))).collect(),
    attributes: js_definition.attributes.iter().map(|attr| into_attribute(attr)).collect(),
    comments: js_definition.comments.clone(),
  }
}
