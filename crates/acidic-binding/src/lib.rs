#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

pub mod parser;
pub mod schema;
pub mod template_engine;
pub mod types;
