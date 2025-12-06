use crate::schema::{into_schema, JsSchema};
use acidic_template_engine::{
  engine::TemplateEngine, handlebars::adapter::HandlebarsTemplateAdapter,
};
use napi::bindgen_prelude::*;

#[napi]
pub struct JsTemplateAdapter {
  inner: HandlebarsTemplateAdapter<'static>,
}

#[napi]
impl JsTemplateAdapter {
  #[napi]
  pub fn get_engine(
    &self,
    reference: Reference<JsTemplateAdapter>,
    env: Env,
  ) -> Result<JsTemplateEngine> {
    Ok(JsTemplateEngine {
      inner: reference.share_with(env, |adapter| Ok(adapter.inner.get_engine()))?,
    })
  }
}

#[napi(js_name = "TemplateEngine")]
pub struct JsTemplateEngine {
  inner: SharedReference<JsTemplateAdapter, TemplateEngine<'static>>,
}

#[napi]
impl JsTemplateEngine {
  #[napi]
  pub fn register(&mut self, template_paths: Vec<&str>) -> Result<()> {
    Ok(self.inner.register(template_paths).unwrap())
  }

  #[napi]
  pub fn generate(&mut self, schema: JsSchema) -> Result<()> {
    Ok(self.inner.generate(into_schema(&schema)).unwrap())
  }
}
