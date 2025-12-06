mod collection;
mod error;
mod native_type_error_factory;
mod pretty_print;
mod span;
mod warning;

pub use collection::Diagnostics;
pub use error::SchemaError;
pub use native_type_error_factory::NativeTypeErrorFactory;
pub use span::Span;
pub use warning::SchemaWarning;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
