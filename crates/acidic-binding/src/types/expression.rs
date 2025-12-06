use super::{
  argument::{from_argument, into_argument, JsArgument},
  node_kind::from_node_kind,
  reference_id::JsReferenceId,
};
use acidic_sdl::{
  core::expression::{Expression, ExpressionValue, ReferenceExpression},
  definitions::schema::Schema,
};

#[napi(string_enum, js_name = "ExpressionType")]
pub enum JsExpressionType {
  /// Any numeric value e.g. floats or ints.
  NumericExpression,
  /// Any string value.
  StringExpression,
  /// Any boolean value (`true` or `false`).
  BooleanExpression,
  /// Any literal string that serves as a reference, basically a string which was not inside "...".
  /// This is used for representing built-in enums or definition references.
  ReferenceExpression,
  /// A function call like node with a name and arguments.
  FunctionExpression,
  /// An array of other values.
  ArrayExpression,
}

#[napi(object, js_name = "FunctionExpression")]
pub struct JsFunctionExpression {
  pub function: String,
  #[napi(ts_type = "Array<Argument>")]
  pub arguments: Vec<JsArgument>,
}

#[napi(object, js_name = "ReferenceExpression")]
pub struct JsReferenceExpression {
  #[napi(ts_type = "ReferenceId")]
  pub value: JsReferenceId,
  #[napi(ts_type = "ReferenceId")]
  pub parent: Option<JsReferenceId>,
}

#[napi(object, js_name = "Expression")]
pub struct JsExpression {
  #[napi(ts_type = "ExpressionType")]
  pub expression_type: JsExpressionType,
  pub literal: String,
  #[napi(ts_type = "FunctionExpression")]
  pub function: Option<JsFunctionExpression>,
  #[napi(ts_type = "ReferenceExpression")]
  pub reference: Option<JsReferenceExpression>,
  #[napi(ts_type = "Array<Expression>")]
  pub items: Option<Vec<JsExpression>>,
}

pub(crate) fn from_expression(expression: &Expression, schema: &Schema) -> JsExpression {
  match &expression.value {
    ExpressionValue::NumericValue(value) => JsExpression {
      expression_type: JsExpressionType::NumericExpression,
      literal: value.to_string(),
      function: None,
      reference: None,
      items: None,
    },
    ExpressionValue::StringValue(value) => JsExpression {
      expression_type: JsExpressionType::StringExpression,
      literal: value.to_string(),
      function: None,
      reference: None,
      items: None,
    },
    ExpressionValue::BooleanValue(value) => JsExpression {
      expression_type: JsExpressionType::BooleanExpression,
      literal: value.to_string(),
      function: None,
      reference: None,
      items: None,
    },
    ExpressionValue::ReferenceValue(_) => {
      let reference_expression = expression.as_reference().unwrap();
      let reference = schema.find_reference_id(&reference_expression).unwrap();

      if let Some(parent_identifier) = reference_expression.parent_identifier.clone() {
        let parent_reference = schema
          .find_reference_id(&ReferenceExpression {
            identifier: parent_identifier,
            parent_identifier: None,
          })
          .unwrap();

        JsExpression {
          expression_type: JsExpressionType::ReferenceExpression,
          literal: expression.literal.clone(),
          function: None,
          reference: Some(JsReferenceExpression {
            value: JsReferenceId {
              kind: from_node_kind(&reference.kind),
              identifier: reference.identifier.clone(),
            },
            parent: Some(JsReferenceId {
              kind: from_node_kind(&parent_reference.kind),
              identifier: parent_reference.identifier,
            }),
          }),
          items: None,
        }
      } else {
        JsExpression {
          expression_type: JsExpressionType::ReferenceExpression,
          literal: expression.literal.clone(),
          function: None,
          reference: Some(JsReferenceExpression {
            value: JsReferenceId {
              kind: from_node_kind(&reference.kind),
              identifier: reference.identifier.clone(),
            },
            parent: None,
          }),
          items: None,
        }
      }
    }
    ExpressionValue::FunctionValue(function, arguments) => JsExpression {
      expression_type: JsExpressionType::FunctionExpression,
      literal: expression.literal.clone(),
      function: Some(JsFunctionExpression {
        function: function.to_string(),
        arguments: arguments.iter().map(|arg| from_argument(arg, schema)).collect(),
      }),
      reference: None,
      items: None,
    },
    ExpressionValue::ArrayValue(value) => JsExpression {
      expression_type: JsExpressionType::ArrayExpression,
      literal: expression.literal.clone(),
      function: None,
      reference: None,
      items: Some(value.iter().map(|exp| from_expression(exp, schema)).collect()),
    },
  }
}

pub(crate) fn into_expression(expression: &JsExpression) -> Expression {
  match expression.expression_type {
    JsExpressionType::NumericExpression => Expression {
      literal: expression.literal.clone(),
      value: ExpressionValue::NumericValue(expression.literal.clone()),
    },
    JsExpressionType::StringExpression => Expression {
      literal: expression.literal.clone(),
      value: ExpressionValue::StringValue(expression.literal.clone()),
    },
    JsExpressionType::BooleanExpression => Expression {
      literal: expression.literal.clone(),
      value: ExpressionValue::BooleanValue(expression.literal.clone()),
    },
    JsExpressionType::ReferenceExpression => Expression {
      literal: expression.literal.clone(),
      value: ExpressionValue::ReferenceValue(expression.literal.clone()),
    },
    JsExpressionType::FunctionExpression => {
      let function = expression.function.as_ref().unwrap();

      Expression {
        literal: expression.literal.clone(),
        value: ExpressionValue::FunctionValue(
          function.function.clone(),
          function.arguments.iter().map(|arg| into_argument(arg)).collect(),
        ),
      }
    }
    JsExpressionType::ArrayExpression => {
      let items =
        expression.items.as_ref().unwrap().iter().map(|exp| into_expression(exp)).collect();

      Expression { literal: expression.literal.clone(), value: ExpressionValue::ArrayValue(items) }
    }
  }
}
