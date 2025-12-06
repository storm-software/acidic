use super::attribute::{from_attribute, into_attribute, JsAttribute};
use acidic_sdl::definitions::{
  field::{Field, FieldType},
  schema::Schema,
};

/// A field definition in a model or a composite type.
#[napi(object, js_name = "Field")]
pub struct JsField {
  pub parent_identifier: String,

  /// The name of the field.
  ///
  /// ```ignore
  /// name String
  /// ^^^^
  /// ```
  pub identifier: String,

  /// The field's type.
  ///
  /// ```ignore
  /// name String
  ///      ^^^^^^
  /// ```
  #[napi(js_name = "FieldType")]
  pub field_type: JsFieldType,

  /// A flag indicating if the field is optional or required.
  ///
  /// ```ignore
  /// name String?
  ///            ^
  /// ```
  pub is_optional: bool,

  /// A flag indicating if the field is an array.
  ///
  /// ```ignore
  /// name String[]
  ///            ^
  /// ```
  pub is_array: bool,

  /// The attributes of this field.
  ///
  /// ```ignore
  /// name String @id @default("my name")
  ///             ^^^^^^^^^^^^^^^^^^^
  /// ```
  #[napi(ts_type = "Array<Attribute>")]
  pub attributes: Vec<JsAttribute>,

  /// The comments for this field.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// name String @id @default("my name")
  /// ```
  pub comments: Vec<String>,
}

/// An arity of a data model field.
#[napi(string_enum, js_name = "FieldType")]
pub enum JsFieldType {
  String,
  Boolean,
  Float,
  Decimal,
  Integer,
  BigInt,
  DateTime,
  Date,
  Time,
  Json,
  Reference,
  Bytes,
  Null,
  Any,
}

pub(crate) fn from_field(field: &Field, schema: &Schema) -> JsField {
  JsField {
    parent_identifier: field.parent_identifier.to_string(),
    identifier: field.identifier.clone(),
    field_type: from_field_type(&field.field_type),
    is_optional: field.is_optional,
    is_array: field.is_array,
    attributes: field.attributes.iter().map(|attr| from_attribute(attr, schema)).collect(),
    comments: field.comments.clone(),
  }
}

fn from_field_type(field_type: &FieldType) -> JsFieldType {
  match field_type {
    FieldType::String => JsFieldType::String,
    FieldType::Boolean => JsFieldType::Boolean,
    FieldType::Float => JsFieldType::Float,
    FieldType::Decimal => JsFieldType::Decimal,
    FieldType::Integer => JsFieldType::Integer,
    FieldType::BigInt => JsFieldType::BigInt,
    FieldType::DateTime => JsFieldType::DateTime,
    FieldType::Date => JsFieldType::Date,
    FieldType::Time => JsFieldType::Time,
    FieldType::Json => JsFieldType::Json,
    FieldType::Reference => JsFieldType::Reference,
    FieldType::Bytes => JsFieldType::Bytes,
    FieldType::Null => JsFieldType::Null,
    FieldType::Any => JsFieldType::Any,
  }
}

pub(crate) fn into_field(field: &JsField) -> Field {
  Field {
    parent_identifier: field.parent_identifier.clone(),
    identifier: field.identifier.clone(),
    field_type: into_field_type(field.field_type),
    is_optional: field.is_optional,
    is_array: field.is_array,
    attributes: field.attributes.iter().map(|attr| into_attribute(attr)).collect(),
    comments: field.comments.clone(),
  }
}

fn into_field_type(field_type: JsFieldType) -> FieldType {
  match field_type {
    JsFieldType::String => FieldType::String,
    JsFieldType::Boolean => FieldType::Boolean,
    JsFieldType::Float => FieldType::Float,
    JsFieldType::Decimal => FieldType::Decimal,
    JsFieldType::Integer => FieldType::Integer,
    JsFieldType::BigInt => FieldType::BigInt,
    JsFieldType::DateTime => FieldType::DateTime,
    JsFieldType::Date => FieldType::Date,
    JsFieldType::Time => FieldType::Time,
    JsFieldType::Json => FieldType::Json,
    JsFieldType::Reference => FieldType::Reference,
    JsFieldType::Bytes => FieldType::Bytes,
    JsFieldType::Null => FieldType::Null,
    JsFieldType::Any => FieldType::Any,
  }
}
