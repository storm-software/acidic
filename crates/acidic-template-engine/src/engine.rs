use crate::{errors::TemplateEngineError, traits::TemplateAdapter};
use acidic_sdl::definitions::schema::Schema;
use std::fs;

pub struct TemplateEngine<'reg> {
  pub adapter: &'reg mut dyn TemplateAdapter,
}

impl<'reg> TemplateEngine<'reg> {
  pub fn register(&mut self, template_paths: Vec<&str>) -> Result<(), TemplateEngineError> {
    template_paths.iter().for_each(|template_path| {
      let template = fs::read_to_string(template_path).unwrap();

      self.adapter.register_template(template_path, template.as_str()).unwrap();
    });

    // for template_path in template_paths {
    //   let template = fs::read_to_string(template_path).unwrap();
    //   match self
    //     .adapter
    //     .inner
    //     .register_template_string(template_path, template)
    //   {
    //     Ok(_) => {}
    //     Err(e) => {
    //       return Err(Error::new(
    //         Status::GenericFailure,
    //         format!("Failed to register template: {}", e),
    //       ));
    //     }
    //   }
    // }

    Ok(())
  }

  pub fn generate(&mut self, schema: Schema) -> Result<(), TemplateEngineError> {
    let _ = schema;

    // for template_path in template_paths {
    //   let template = fs::read_to_string(template_path).unwrap();
    //   match self
    //     .adapter
    //     .inner
    //     .register_template_string(template_path, template)
    //   {
    //     Ok(_) => {}
    //     Err(e) => {
    //       return Err(Error::new(
    //         Status::GenericFailure,
    //         format!("Failed to register template: {}", e),
    //       ));
    //     }
    //   }
    // }

    Ok(())
  }
}

// #[derive(Clone)]
// pub struct HandlebarsTemplateRegistry<'reg> {
//   pub inner: Handlebars<'reg>,
//   pub adapter: HandlebarsTemplateAdapter,
// }

// impl<'reg> HandlebarsTemplateRegistry<'reg> {
//   pub fn register_template(
//     &mut self,
//     name: &str,
//     template: &str,
//   ) -> Result<(), crate::template::types::TemplateError> {
//   }
// }

// #[napi]
// pub struct TemplateAdapter {
//   inner: HandlebarsTemplateAdapter,
// }

// #[napi]
// impl TemplateAdapter {
//   #[napi(constructor)]
//   pub fn new() -> Self {
//     TemplateAdapter { inner: HandlebarsTemplateAdapter { registry: Handlebars::new() } }
//   }

//   #[napi]
//   pub fn get_engine(
//     &self,
//     reference: Reference<TemplateAdapter>,
//     env: Env,
//   ) -> Result<TemplateEngine> {
//     Ok(TemplateEngine {
//       adapter: reference.share_with(env, |adapter| Ok(adapter.inner.get_registry()))?,
//     })
//   }
// }

// pub struct TemplateEngine<'static> {
//   adapter: SharedReference<TemplateAdapter, HandlebarsTemplateRegistry<'static>>,
// }

// impl TemplateEngine {

//   pub fn register(&mut self, template_paths: Vec<&str>) -> Result<()> {
//     self.adapter.inner.register_escape_fn(handlebars::no_escape);

//     template_paths.iter().for_each(|template_path| {
//       let template = fs::read_to_string(template_path).unwrap();
//       self.adapter.inner.register_template_string(template_path, template).unwrap();
//     });

//     // for template_path in template_paths {
//     //   let template = fs::read_to_string(template_path).unwrap();
//     //   match self
//     //     .adapter
//     //     .inner
//     //     .register_template_string(template_path, template)
//     //   {
//     //     Ok(_) => {}
//     //     Err(e) => {
//     //       return Err(Error::new(
//     //         Status::GenericFailure,
//     //         format!("Failed to register template: {}", e),
//     //       ));
//     //     }
//     //   }
//     // }

//     Ok(())
//   }

//   pub fn generate(&mut self, schema: Schema) -> Result<()> {
//     let _ = schema;
//     self.adapter.inner.register_escape_fn(handlebars::no_escape);

//     // for template_path in template_paths {
//     //   let template = fs::read_to_string(template_path).unwrap();
//     //   match self
//     //     .adapter
//     //     .inner
//     //     .register_template_string(template_path, template)
//     //   {
//     //     Ok(_) => {}
//     //     Err(e) => {
//     //       return Err(Error::new(
//     //         Status::GenericFailure,
//     //         format!("Failed to register template: {}", e),
//     //       ));
//     //     }
//     //   }
//     // }

//     Ok(())
//   }
// }
