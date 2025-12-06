use acidic_sdl::core::types::NodeKind;

#[napi(string_enum, js_name = "NodeKind")]
pub enum JsNodeKind {
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

pub(crate) fn from_node_kind(kind: &NodeKind) -> JsNodeKind {
  match kind {
    NodeKind::Model => JsNodeKind::Model,
    NodeKind::Definition => JsNodeKind::Definition,
    NodeKind::Enumeration => JsNodeKind::Enumeration,
    NodeKind::EnumerationValue => JsNodeKind::EnumerationValue,
    NodeKind::Field => JsNodeKind::Field,
    NodeKind::Event => JsNodeKind::Event,
    NodeKind::Query => JsNodeKind::Query,
    NodeKind::Mutation => JsNodeKind::Mutation,
    NodeKind::Subscription => JsNodeKind::Subscription,
    NodeKind::Plugin => JsNodeKind::Plugin,
    NodeKind::DateSource => JsNodeKind::DateSource,
    NodeKind::Schema => JsNodeKind::Schema,
  }
}

pub(crate) fn into_node_kind(kind: JsNodeKind) -> NodeKind {
  match kind {
    JsNodeKind::Model => NodeKind::Model,
    JsNodeKind::Definition => NodeKind::Definition,
    JsNodeKind::Enumeration => NodeKind::Enumeration,
    JsNodeKind::EnumerationValue => NodeKind::EnumerationValue,
    JsNodeKind::Field => NodeKind::Field,
    JsNodeKind::Event => NodeKind::Event,
    JsNodeKind::Query => NodeKind::Query,
    JsNodeKind::Mutation => NodeKind::Mutation,
    JsNodeKind::Subscription => NodeKind::Subscription,
    JsNodeKind::Plugin => NodeKind::Plugin,
    JsNodeKind::DateSource => NodeKind::DateSource,
    JsNodeKind::Schema => NodeKind::Schema,
  }
}
