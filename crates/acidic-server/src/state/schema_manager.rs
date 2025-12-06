use super::cache::CacheManager;
use acidic_config::acidic_config::AcidicConfig;
use acidic_diagnostics::Diagnostics;
use acidic_parser::{
  ast::schema_ast::SchemaAst, types::SchemaFile, utils::parse_schema::parse_schema,
};
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub struct SchemaManager {
  pub config: AcidicConfig,
  pub(crate) cache: CacheManager,
}

impl SchemaManager {
  pub fn new(config: &AcidicConfig) -> Self {
    SchemaManager {
      config: config.clone(),
      cache: CacheManager::new(config.cache_directory.clone()),
    }
  }

  pub async fn parse(&self, schema_file: SchemaFile) -> Result<SchemaAst, Diagnostics> {
    match self.cache.read_ast(&self.get_file_hash(&schema_file)).await {
      Ok(schema) => Ok(schema),
      Err(_) => {
        let mut diagnostics = Diagnostics::new();

        let schema = parse_schema(&schema_file.text.clone(), &mut diagnostics);

        self
          .cache
          .write_ast(&self.get_file_hash(&schema_file), &schema)
          .await
          .expect("An error occured while writing Schema AST to cache");
        Ok(schema)
      }
    }
  }

  fn get_file_hash(&self, schema_file: &SchemaFile) -> String {
    let mut file_hasher = DefaultHasher::new();

    let file = SchemaFile {
      text: schema_file.text.split_whitespace().collect::<String>(),
      ..schema_file.clone()
    };

    file.hash(&mut file_hasher);
    file_hasher.finish().to_string()
  }
}
