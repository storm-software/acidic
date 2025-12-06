use super::node_kind::JsNodeKind;

/// An Acidic schema node ReferenceId.
#[napi(object, js_name = "ReferenceId")]
pub struct JsReferenceId {
  /// The node contents.
  pub identifier: String,

  #[napi(ts_type = "NodeKind")]
  /// The kind of the schema node.
  pub kind: JsNodeKind,
}
