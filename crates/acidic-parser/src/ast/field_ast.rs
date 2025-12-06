use super::attribute_ast::AttributeAst;
use serde::{Deserialize, Serialize};
use std::str::FromStr;

/// A field definition in a model or a composite type.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct FieldAst {
  /// The name of the field.
  ///
  /// ```ignore
  /// name String
  /// ^^^^
  /// ```
  pub id: String,

  /// The field's type.
  ///
  /// ```ignore
  /// name String
  ///      ^^^^^^
  /// ```
  pub r#type: FieldTypeAst,

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
  pub attributes: Vec<AttributeAst>,

  /// The comments for this field.
  ///
  /// ```ignore
  /// /// Lorem ipsum
  ///     ^^^^^^^^^^^
  /// name String @id @default("my name")
  /// ```
  pub comments: Vec<String>,
}

/// The type of a data model field.
#[derive(Deserialize, Serialize, Clone, Debug)]
pub enum FieldTypeAst {
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
  Bytes,
  Null,
  Any,
  ReferencePath(String),
}

impl FromStr for FieldTypeAst {
  type Err = ();

  fn from_str(input: &str) -> Result<FieldTypeAst, Self::Err> {
    match input {
      "String" => Ok(FieldTypeAst::String),
      "Boolean" => Ok(FieldTypeAst::Boolean),
      "Float" => Ok(FieldTypeAst::Float),
      "Decimal" => Ok(FieldTypeAst::Decimal),
      "Integer" => Ok(FieldTypeAst::Integer),
      "BigInt" => Ok(FieldTypeAst::BigInt),
      "DateTime" => Ok(FieldTypeAst::DateTime),
      "Date" => Ok(FieldTypeAst::Date),
      "Time" => Ok(FieldTypeAst::Time),
      "Json" => Ok(FieldTypeAst::Json),
      "Bytes" => Ok(FieldTypeAst::Bytes),
      "Null" => Ok(FieldTypeAst::Null),
      "Any" => Ok(FieldTypeAst::Any),
      reference_path => Ok(FieldTypeAst::ReferencePath(reference_path.to_string())),
    }
  }
}
