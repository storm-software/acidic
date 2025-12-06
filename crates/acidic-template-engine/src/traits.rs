use crate::errors::TemplateEngineError;
use std::collections::BTreeMap;

pub trait TemplateAdapter {
  fn register_template(&mut self, name: &str, template: &str) -> Result<(), TemplateEngineError>;
  fn render_template(
    &self,
    name: &str,
    values: BTreeMap<&str, &str>,
  ) -> Result<String, TemplateEngineError>;
}

pub trait WithCreateAdapter {
  fn create_adapter(&self) -> impl TemplateAdapter;
}
