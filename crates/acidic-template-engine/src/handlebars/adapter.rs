use crate::{engine::TemplateEngine, errors::TemplateEngineError, traits::TemplateAdapter};
use handlebars::Handlebars;
use std::{borrow::BorrowMut, collections::BTreeMap};

pub struct HandlebarsTemplateAdapter<'reg> {
  pub registry: Handlebars<'reg>,
}

impl<'reg> HandlebarsTemplateAdapter<'reg> {
  pub fn new(registry: Handlebars<'reg>) -> Self {
    HandlebarsTemplateAdapter { registry }
  }

  pub fn get_registry(&self) -> &Handlebars<'reg> {
    &self.registry
  }

  pub fn get_engine(&mut self) -> TemplateEngine {
    TemplateEngine { adapter: self.borrow_mut() as &mut dyn TemplateAdapter }
  }
}

impl<'reg> TemplateAdapter for HandlebarsTemplateAdapter<'reg> {
  fn register_template(&mut self, name: &str, template: &str) -> Result<(), TemplateEngineError> {
    match self.registry.register_template_string(name, template) {
      Ok(_) => Ok(()),
      Err(e) => Err(TemplateEngineError::RegisterError(e.to_string())),
    }
  }

  fn render_template(
    &self,
    name: &str,
    values: BTreeMap<&str, &str>,
  ) -> Result<String, TemplateEngineError> {
    match self.registry.render(name, &values) {
      Ok(rendered) => Ok(rendered),
      Err(e) => Err(TemplateEngineError::RenderError(e.to_string())),
    }
  }
}

// impl WithCreateAdapter for TemplateEngine {
//   fn create_adapter(&self) -> impl TemplateAdapter {
//     HandlebarsTemplateAdapter { registry: Handlebars::new(), engine: &self }
//   }
// }

// #[derive(Clone)]
// pub struct HandlebarsTemplateRegistry<'reg> {
//   pub inner: Handlebars<'reg>,
//   pub adapter: HandlebarsTemplateAdapter,
// }

// impl<'reg> HandlebarsTemplateRegistry<'reg> {}

// impl FromNapiValue for HandlebarsTemplateRegistry<'static> {
//   unsafe fn from_napi_value(env: sys::napi_env, napi_value: sys::napi_value) -> napi::Result<Self> {
//     let mut result = std::ptr::null_mut();
//     check_status!(
//       sys::napi_unwrap(env, napi_value, &mut result),
//       "Failed to unwrap napi value"
//     )?;

//     Ok(std::ptr::read(result as *const Self))
//   }
// }

// impl TemplateRegistry for HandlebarsTemplateRegistry<'_> {
//   fn register_template(
//     &mut self,
//     name: &str,
//     template: &str,
//   ) -> Result<(), crate::template::types::TemplateError> {
//     match self.registry.register_template_string(name, template) {
//       Ok(_) => Ok(()),
//       Err(e) => Err(TemplateError::RegisterError(e.to_string())),
//     }
//   }

//   fn render_template(
//     &self,
//     name: &str,
//     values: BTreeMap<&str, &str>,
//   ) -> Result<String, crate::template::types::TemplateError> {
//     match self.registry.render(name, &values) {
//       Ok(rendered) => Ok(rendered),
//       Err(e) => Err(TemplateError::RenderError(e.to_string())),
//     }
//   }
// }
