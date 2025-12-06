use super::expression::{from_expression, into_expression, JsExpression};
use acidic_sdl::{core::argument::Argument, definitions::schema::Schema};

/// An argument, either for attributes or for function call expressions.
#[napi(object, js_name = "Argument")]
pub struct JsArgument {
  /// The argument identifier, if applicable.
  ///
  /// ```ignore
  /// @id(map: "myIndex")
  ///     ^^^
  /// ```
  pub identifier: Option<String>,

  /// The argument value.
  ///
  /// ```ignore
  /// @id("myIndex")
  ///     ^^^^^^^^^
  /// ```
  #[napi(ts_type = "Expression")]
  pub value: JsExpression,

  /// The argument default value.
  ///
  /// ```ignore
  /// @id(map: String = "myIndex")
  ///                   ^^^^^^^^^
  /// ```
  #[napi(ts_type = "Expression")]
  pub default: Option<JsExpression>,
}

pub(crate) fn from_argument(arg: &Argument, schema: &Schema) -> JsArgument {
  JsArgument {
    identifier: arg.identifier.clone(),
    value: from_expression(&arg.value, schema),
    default: arg.default.clone().map(|exp| from_expression(&exp, schema)),
  }
}

pub(crate) fn into_argument(arg: &JsArgument) -> Argument {
  match &arg.default {
    Some(default) => Argument {
      identifier: arg.identifier.clone(),
      value: into_expression(&arg.value),
      default: Some(into_expression(&default)),
    },
    None => Argument {
      identifier: arg.identifier.clone(),
      value: into_expression(&arg.value),
      default: None,
    },
  }
}
