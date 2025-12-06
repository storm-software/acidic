use crate::expression::Expression;
use serde::{Deserialize, Serialize};

/// An enum representing the different kinds of nodes in the Acidic schema.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum NodeKind {
  Model,
  Definition,
  Enumeration,
  EnumerationValue,
  Field,
  Event,
  Query,
  Mutation,
  Subscription,
  Plugin,
  DateSource,
  Schema,
}

/// A named property in a schema node
///
/// ```ignore
/// datasource db {
///     url = env("URL")
///     ^^^^^^^^^^^^^^^^
/// }
/// ```
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NameValuePair {
  /// The property name.
  ///
  /// ```ignore
  /// datasource db {
  ///     url = env("URL")
  ///     ^^^
  /// }
  /// ```
  ///
  pub name: String,

  /// The property value.
  ///
  /// ```ignore
  /// datasource db {
  ///     url = env("URL")
  ///           ^^^^^^^^^^
  /// }
  /// ```
  pub value: Option<Expression>,
}
