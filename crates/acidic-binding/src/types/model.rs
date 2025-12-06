use super::{
  attribute::{from_attribute, into_attribute, JsAttribute},
  field::{from_field, into_field, JsField},
};
use acidic_sdl::definitions::{model::Model, schema::Schema};
use std::collections::HashMap;

/// A model declaration.
#[napi(object, js_name = "Model")]
pub struct JsModel {
  /// The name of the model.
  ///
  /// ```ignore
  /// model Foo { .. }
  ///       ^^^
  /// ```
  pub identifier: String,

  /// The fields of the model.
  ///
  /// ```ignore
  /// model Foo {
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

  /// Is the model defined as a view in the database.
  ///
  /// ```ignore
  /// view Foo {
  ///   val Int @unique
  /// }
  /// ```
  pub is_view: bool,
}

pub(crate) fn from_model(model: &Model, schema: &Schema) -> JsModel {
  JsModel {
    identifier: model.identifier.clone(),
    fields: model.fields.iter().map(|(k, v)| (k.clone(), from_field(v, schema))).collect(),
    attributes: model.attributes.iter().map(|a| from_attribute(a, schema)).collect(),
    comments: model.comments.clone(),
    is_view: model.is_view,
  }
}

pub(crate) fn into_model(js_model: &JsModel) -> Model {
  Model {
    identifier: js_model.identifier.clone(),
    fields: js_model.fields.iter().map(|(k, v)| (k.clone(), into_field(v))).collect(),
    attributes: js_model.attributes.iter().map(|a| into_attribute(a)).collect(),
    comments: js_model.comments.clone(),
    is_view: js_model.is_view,
  }
}
