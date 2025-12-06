use super::argument::Argument;
use crate::{ref_id::RefId, types::NodeKind};
use serde::{Deserialize, Serialize};
use std::fmt::{self, Debug};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FunctionExpression {
  pub function: String,
  pub arguments: Vec<Argument>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ExpressionType {
  /// Any numeric value e.g. floats or ints.
  NumericValue(String),
  /// Any string value.
  StringValue(String),
  /// Any boolean value (`true` or `false`).
  BooleanValue(String),
  /// Any literal string that serves as a reference, basically a string which was not inside "...".
  /// This is used for representing built-in enums or definition references.
  RefIdValue(String, Option<String>, String, NodeKind),
  /// A function call like node with a name and arguments.
  FunctionValue(String, Vec<Argument>),
  /// An array of other values.
  ArrayValue(Vec<Expression>),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Expression {
  pub r#type: ExpressionType,
  pub value: String,
}

impl Debug for Expression {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "Expression {{ value: {:?}, type: {:?} }}", self.value, self.r#type)
  }
}

impl Expression {
  pub fn as_array(&self) -> Option<&[Expression]> {
    match &self.value {
      ExpressionType::ArrayValue(items) => Some(items),
      _ => None,
    }
  }

  pub fn as_string(&self) -> Option<&String> {
    match &self.value {
      ExpressionType::StringValue(value) => Some(value),
      _ => None,
    }
  }

  pub fn as_boolean(&self) -> Option<bool> {
    match &self.value {
      ExpressionType::BooleanValue(value) => Some(value == "true"),
      _ => None,
    }
  }

  pub fn as_function(&self) -> Option<FunctionExpression> {
    match &self.value {
      ExpressionType::FunctionValue(function, arguments) => {
        Some(FunctionExpression { function: function.to_string(), arguments: arguments.to_vec() })
      }
      _ => None,
    }
  }

  pub fn as_numeric(&self) -> Option<&String> {
    match &self.value {
      ExpressionType::NumericValue(value) => Some(value),
      _ => None,
    }
  }

  pub fn as_ref_id(&self) -> Option<RefId> {
    match &self.value {
      ExpressionType::RefIdValue(schema_name, parent_name, name, node_kind) => {
        let mut ref_id =
          RefId::new(schema_name.clone(), parent_name.clone(), name.clone(), node_kind.clone());

        Some(ref_id)
      }
      _ => None,
    }
  }

  /// Creates a friendly readable representation for a value's type.
  pub fn describe_value_type(&self) -> &'static str {
    match &self.value {
      ExpressionType::NumericValue(_) => "numeric",
      ExpressionType::StringValue(_) => "string",
      ExpressionType::BooleanValue(_) => "boolean",
      ExpressionType::RefIdValue(_, _, _, _) => "reference",
      ExpressionType::FunctionValue(_, _) => "functional",
      ExpressionType::ArrayValue(_) => "array",
    }
  }

  pub fn is_function(&self) -> bool {
    matches!(&self.value, ExpressionType::FunctionValue(_, _))
  }

  pub fn is_array(&self) -> bool {
    matches!(&self.value, ExpressionType::ArrayValue(_))
  }

  pub fn is_string(&self) -> bool {
    matches!(&self.value, ExpressionType::StringValue(_))
  }

  pub fn is_numeric(&self) -> bool {
    matches!(&self.value, ExpressionType::NumericValue(_))
  }

  pub fn is_boolean(&self) -> bool {
    matches!(&self.value, ExpressionType::BooleanValue(_))
  }

  pub fn is_reference(&self) -> bool {
    matches!(&self.value, ExpressionType::RefIdValue(_, _, _, _))
  }
}

// #[napi]
// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct OptionalExpression(Option<Expression>);

// impl FromNapiValue for OptionalExpression {
//   unsafe fn from_napi_value(env: sys::napi_env, napi_val: sys::napi_value) -> Result<Self> {
//     let mut val_type = 0;

//     check_status!(
//       unsafe { sys::napi_typeof(env, napi_val, &mut val_type) },
//       "Failed to convert napi value into rust type `Option<T>`",
//     )?;

//     match val_type {
//       sys::ValueType::napi_undefined | sys::ValueType::napi_null => Ok(None),
//       _ => Ok(Some(unsafe { Expression::from_napi_value(env, napi_val)? })),
//     }
//   }
// }

//   #[napi]
//   pub fn as_node_kind(&self, schema: Schema) -> Option<NodeKind> {
//     match &self.expression_type {
//       ExpressionType::Literal => {
//         let literal_value = self.as_literal().unwrap();

//         let mut split = literal_value.split(".");
//         if split.clone().count() >= 2 {
//           let parent = split.next().unwrap();
//           let value = split.next().unwrap();

//           if let Some(enumeration) = schema.find_enumeration(parent) {
//             if let Some(_) = enumeration.find_value(value) {
//               return Some(NodeKind::EnumerationValue);
//             }
//           } else if let Some(definition) = schema.find_definition(parent) {
//             if let Some(_) = definition.find_field(value) {
//               return Some(NodeKind::Field);
//             }
//           }
//         } else if split.clone().count() == 1 {
//           if let Some(_) = schema.find_enumeration(&literal_value) {
//             return Some(NodeKind::Enumeration);
//           } else if let Some(_) = schema.find_definition(&literal_value) {
//             return Some(NodeKind::Definition);
//           } else if let Some(_) = schema
//             .enumerations
//             .iter()
//             .find(|enumeration| enumeration.find_value(&literal_value).is_some())
//           {
//             return Some(NodeKind::EnumerationValue);
//           } else if let Some(_) = schema
//             .definitions
//             .iter()
//             .find(|definition| definition.find_field(&literal_value).is_some())
//           {
//             return Some(NodeKind::Field);
//           }
//         }

//         None
//       }
//       _ => None,
//     }
//   }

//   pub fn as_enumeration_value_reference(
//     &self,
//     schema: Schema,
//   ) -> Option<ReferenceExpression<EnumerationValue, Enumeration>> {
//     match &self.expression_type {
//       ExpressionType::Literal => {
//         let literal_value = self.as_literal().unwrap();

//         let mut split = literal_value.split(".");
//         if split.clone().count() >= 2 {
//           let parent = split.next().unwrap();
//           let value = split.next().unwrap();

//           if let Some(enumeration) = schema.find_enumeration(parent) {
//             if let Some(enumeration_value) = enumeration.find_value(value) {
//               return Some(ReferenceExpression {
//                 kind: NodeKind::EnumerationValue,
//                 parent: enumeration.clone(),
//                 value: enumeration_value.clone(),
//               });
//             }
//           }
//         } else if split.clone().count() == 1 {
//           if let Some(enumeration) = schema
//             .enumerations
//             .iter()
//             .find(|enumeration| enumeration.find_value(&literal_value).is_some())
//           {
//             if let Some(enumeration_value) = enumeration.find_value(&literal_value) {
//               return Some(ReferenceExpression {
//                 kind: NodeKind::EnumerationValue,
//                 parent: enumeration.clone(),
//                 value: enumeration_value.clone(),
//               });
//             }
//           }
//         }

//         None
//       }
//       _ => None,
//     }
//   }

//   pub fn as_enumeration_reference(
//     &self,
//     schema: Schema,
//   ) -> Option<ReferenceExpression<Enumeration, Null>> {
//     match &self.expression_type {
//       ExpressionType::Literal => {
//         let literal_value = self.as_literal().unwrap();

//         if let Some(enumeration) = schema.find_enumeration(&literal_value) {
//           return Some(ReferenceExpression {
//             kind: NodeKind::Enumeration,
//             parent: Null,
//             value: enumeration.clone(),
//           });
//         }
//       }
//       _ => {
//         return None;
//       }
//     }

//     None
//   }

//   pub fn as_definition_field_reference(
//     &self,
//     schema: Schema,
//   ) -> Option<ReferenceExpression<Field, Definition>> {
//     match &self.expression_type {
//       ExpressionType::Literal => {
//         let literal_value = self.as_literal().unwrap();

//         let mut split = literal_value.split(".");
//         if split.clone().count() >= 2 {
//           let parent = split.next().unwrap();
//           let value = split.next().unwrap();

//           if let Some(definition) = schema.find_definition(parent) {
//             if let Some(field) = definition.find_field(value) {
//               return Some(ReferenceExpression {
//                 kind: NodeKind::Field,
//                 parent: definition.clone(),
//                 value: field.clone(),
//               });
//             }
//           }
//         } else if split.clone().count() == 1 {
//           if let Some(definition) = schema
//             .definitions
//             .iter()
//             .find(|definition: &&Definition| definition.find_field(&literal_value).is_some())
//           {
//             if let Some(field) = definition.find_field(&literal_value) {
//               return Some(ReferenceExpression {
//                 kind: NodeKind::Field,
//                 parent: definition.clone(),
//                 value: field.clone(),
//               });
//             }
//           }
//         }

//         None
//       }
//       _ => None,
//     }
//   }

//   pub fn as_definition_reference(
//     &self,
//     schema: Schema,
//   ) -> Option<ReferenceExpression<Definition, Null>> {
//     match &self.expression_type {
//       ExpressionType::Literal => {
//         let literal_value = self.as_literal().unwrap();

//         if let Some(definition) = schema.find_definition(&literal_value) {
//           return Some(ReferenceExpression {
//             kind: NodeKind::Definition,
//             parent: Null,
//             value: definition.clone(),
//           });
//         }
//       }
//       _ => {
//         return None;
//       }
//     }

//     None
//   }

// impl Clone for Expression {
//   fn clone(&self) -> Expression {
//     match self.expression_type {
//       ExpressionType::NumericValue => Expression {
//         expression_type: self.expression_type.clone(),
//         string_literal: self.string_literal.clone(),
//         function: None,
//         reference: None,
//         array: None,
//       },
//       ExpressionType::StringValue => Expression {
//         expression_type: self.expression_type.clone(),
//         string_literal: self.string_literal.clone(),
//         function: None,
//         reference: None,
//         array: None,
//       },
//       ExpressionType::Literal => Expression {
//         expression_type: self.expression_type.clone(),
//         string_literal: self.string_literal.clone(),
//         function: None,
//         reference: self.reference.clone(),
//         array: None,
//       },
//       ExpressionType::Function => Expression {
//         expression_type: self.expression_type.clone(),
//         string_literal: self.string_literal.clone(),
//         function: self.function.clone(),
//         reference: None,
//         array: None,
//       },
//       ExpressionType::Array => Expression {
//         expression_type: self.expression_type.clone(),
//         string_literal: self.string_literal.clone(),
//         function: None,
//         reference: None,
//         array: self.array.clone(),
//       },
//     }
//   }
// }

// pub struct ReferenceExpression<V, P> {
//     pub kind: NodeKind,
//     pub value: V,
//     pub parent: P,
//   }

// impl Debug for Expression {
//   fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//     write!(
//       f,
//       "Expression {{ expression_type: {:?}, value: {:?} }}",
//       self.expression_type, self.value
//     )
//   }
// }

// impl ExpressionValue for FunctionExpression {
//   type Value = (String, Vec<Argument>);

//   fn value(&self) -> Self::Value {
//     (self.function.clone(), self.arguments.clone())
//   }
// }

// pub trait ReferenceExpression {
//   type Value;
//   type Parent;

//   fn value(&self, schema: Schema) -> Self::Value;
//   fn parent(&self, schema: Schema) -> Self::Parent;
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct EnumerationValueReferenceExpression {
//   literal: String,
// }

// impl ReferenceExpression for EnumerationValueReferenceExpression {
//   type Value = EnumerationValue;
//   type Parent = Enumeration;

//   fn value(&self, schema: Schema) -> Self::Value {
//     let enumeration = schema.find_enumeration(self.literal.as_str()).unwrap();

//     enumeration
//       .find_value(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }

//   fn parent(&self, schema: Schema) -> Self::Parent {
//     schema
//       .find_enumeration(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct EnumerationReferenceExpression {
//   literal: String,
// }

// impl ReferenceExpression for EnumerationReferenceExpression {
//   type Value = Enumeration;
//   type Parent = Null;

//   fn value(&self, schema: Schema) -> Self::Value {
//     schema
//       .find_enumeration(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }

//   fn parent(&self, _: Schema) -> Self::Parent {
//     Null
//   }
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct DefinitionFieldReferenceExpression {
//   literal: String,
// }

// impl ReferenceExpression for DefinitionFieldReferenceExpression {
//   type Value = Field;
//   type Parent = Definition;

//   fn value(&self, schema: Schema) -> Self::Value {
//     let definition = schema.find_definition(self.literal.as_str()).unwrap();

//     definition
//       .find_field(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }

//   fn parent(&self, schema: Schema) -> Self::Parent {
//     schema
//       .find_definition(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct DefinitionReferenceExpression {
//   literal: String,
// }

// impl ReferenceExpression for DefinitionReferenceExpression {
//   type Value = Definition;
//   type Parent = Null;

//   fn value(&self, schema: Schema) -> Self::Value {
//     schema
//       .find_definition(self.literal.as_str())
//       .unwrap()
//       .clone()
//   }

//   fn parent(&self, _: Schema) -> Self::Parent {
//     Null
//   }
// }
