use crate::schema::JsSchema;

#[napi(object)]
pub struct Context {
  pub schema: JsSchema,
  pub kind: u32,
}
