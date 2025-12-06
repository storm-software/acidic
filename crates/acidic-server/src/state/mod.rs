//! Schema Parser Caching
//!
//! When the parser is ran against an Acidic schema, the results are cached to the developer's local file system. This is done using the [`cacache`] crate.
//!
//! # Parser Cache Manager
//! The [`ParserCacheManager`] struct is used to manage the caching of the parser results. The `ParserCacheManager` struct has a single field, [`cache_directory`], which is used to store the directory name the cache files will be written into. The [`ParserCacheManager`] struct has two methods, [`write_cache`] and [`read_cache`], which are used to write and read the cache respectively. The [`write_cache`] method takes a key and a schema as input and writes the cache to the file system using the [`cacache::write`] method. The [`read_cache`] method takes a key and a data as input and reads the cache from the file system using the [`cacache::read`] method. The [`ParserCacheManager`] struct is used to manage the caching of the parser results.
//!
//!
//! ```rust
//! use cacache;
//!
//! let manager = ParserCacheManager {
//!  cache_directory: "/tmp/cache"
//! };
//!
//! manager.read_cache("file_name".to_string());
//! ```
//!

pub mod cache;
pub mod schema_manager;
