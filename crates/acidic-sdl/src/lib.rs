//! # Acidic Schema Crate
//!
//! A library for parsing and manipulating the Acidic schema language. The schema language is used to define the structure of a database, including models, fields, and relationships.
//!
//! ## Example
//!
//! ```rust
//! use schema::parser::parse;
//!
//! let schema = parse("model User { id Int @id }");
//!
//! ```
//!

pub mod argument;
pub mod attribute;
pub mod data_source;
pub mod definition;
pub mod enumeration;
pub mod expression;
pub mod field;
pub mod model;
pub mod plugin;
pub mod ref_id;
pub mod schema;
pub mod traits;
pub mod types;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
