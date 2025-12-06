use thiserror::Error;

#[derive(Error, Debug)]
pub enum TemplateEngineError {
  #[error("A failure occured while trying to register the template path: {0}")]
  RegisterError(String),
  #[error("A failure occured while trying to render the template: {0}")]
  RenderError(String),
}
