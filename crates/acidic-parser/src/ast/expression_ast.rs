use super::argument_ast::ArgumentAst;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ExpressionAst {
  /// Any numeric value e.g. floats or ints.
  NumericValue(String),
  /// Any string value.
  StringValue(String),
  /// Any literal string that serves as a reference, basically a string which was not inside "...".
  /// This is used for representing booleans, built-in enums, or definition references.
  LiteralValue(String),
  /// A function call like node with a name and arguments.
  FunctionValue(String, Vec<ArgumentAst>),
  /// An array of other values.
  ArrayValue(Vec<ExpressionAst>),
}

impl ExpressionAst {
  pub fn as_array(&self) -> Option<&[ExpressionAst]> {
    match &self {
      ExpressionAst::ArrayValue(items) => Some(items),
      _ => None,
    }
  }

  pub fn as_string(&self) -> Option<&String> {
    match &self {
      ExpressionAst::StringValue(value) => Some(value),
      _ => None,
    }
  }

  pub fn as_function(&self) -> Option<(String, Vec<ArgumentAst>)> {
    match &self {
      ExpressionAst::FunctionValue(id, arguments) => Some((id.clone(), arguments.clone())),
      _ => None,
    }
  }

  pub fn as_numeric(&self) -> Option<&String> {
    match &self {
      ExpressionAst::NumericValue(value) => Some(value),
      _ => None,
    }
  }

  pub fn as_literal(&self) -> Option<&String> {
    match &self {
      ExpressionAst::LiteralValue(value) => Some(value),
      _ => None,
    }
  }

  /// Creates a friendly readable representation for a value's type.
  pub fn describe(&self) -> &'static str {
    match &self {
      ExpressionAst::NumericValue(_) => "numeric",
      ExpressionAst::StringValue(_) => "string",
      ExpressionAst::LiteralValue(_) => "literal",
      ExpressionAst::FunctionValue(_, _) => "functional",
      ExpressionAst::ArrayValue(_) => "array",
    }
  }

  pub fn is_function(&self) -> bool {
    matches!(&self, ExpressionAst::FunctionValue(_, _))
  }

  pub fn is_array(&self) -> bool {
    matches!(&self, ExpressionAst::ArrayValue(_))
  }

  pub fn is_string(&self) -> bool {
    matches!(&self, ExpressionAst::StringValue(_))
  }

  pub fn is_numeric(&self) -> bool {
    matches!(&self, ExpressionAst::NumericValue(_))
  }

  pub fn is_literal(&self) -> bool {
    matches!(&self, ExpressionAst::LiteralValue(_))
  }
}
