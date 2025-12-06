use crate::core::{
  attribute::Attribute,
  expression::Expression,
  reference_id::ReferenceId,
  traits::{WithAttributes, WithIdentifier, WithKind, WithReferenceId},
  types::NodeKind,
};
use serde::{Deserialize, Serialize};
use std::str::FromStr;

/// A field definition in a model or a composite type.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Field {
  pub parent_identifier: String,

  /// The name of the field.
  ///
  /// ```ignore
  /// name String
  /// ^^^^
  /// ```
  pub name: String,

  /// The field's type.
  ///
  /// ```ignore
  /// name String
  ///      ^^^^^^
  /// ```
  pub field_type: FieldType,

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
  pub attributes: Vec<Attribute>,

  /// The comments for this field.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// name String @id @default("my name")
  /// ```
  pub comments: Vec<String>,
}

impl Field {
  pub fn is_id(&self) -> bool {
    self.attributes.iter().any(|attr| attr.identifier == "id")
  }

  pub fn default_value(&self) -> Option<Expression> {
    match self.attributes.iter().find(|attr| attr.identifier == "default") {
      Some(default_attr) => Some(default_attr.arguments.first().unwrap().value.clone()),
      _ => None,
    }
  }
}

impl WithKind for Field {
  fn kind(&self) -> &NodeKind {
    &NodeKind::Field
  }
}

impl WithAttributes for Field {
  fn attributes(&self) -> &[Attribute] {
    &self.attributes
  }
}

/// An arity of a data model field.
#[derive(Deserialize, Serialize, Clone, Debug)]
pub enum FieldType {
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

impl FromStr for FieldType {
  type Err = ();

  fn from_str(input: &str) -> Result<FieldType, Self::Err> {
    match input {
      "String" => Ok(FieldType::String),
      "Boolean" => Ok(FieldType::Boolean),
      "Float" => Ok(FieldType::Float),
      "Decimal" => Ok(FieldType::Decimal),
      "Integer" => Ok(FieldType::Integer),
      "BigInt" => Ok(FieldType::BigInt),
      "DateTime" => Ok(FieldType::DateTime),
      "Date" => Ok(FieldType::Date),
      "Time" => Ok(FieldType::Time),
      "Json" => Ok(FieldType::Json),
      "Reference" => Ok(FieldType::Reference),
      "Bytes" => Ok(FieldType::Bytes),
      "Null" => Ok(FieldType::Null),
      "Any" => Ok(FieldType::Any),
      _ => Err(()),
    }
  }
}
