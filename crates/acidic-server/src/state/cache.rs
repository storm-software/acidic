use acidic_parser::ast::schema_ast::SchemaAst;
use cacache::Integrity;
use std::fs::create_dir_all;

pub(crate) struct CacheManager {
  cache_directory: String,
}

impl CacheManager {
  pub fn new(cache_directory: String) -> Self {
    let ast_cache_directory = format!("{}/ast", cache_directory);
    create_dir_all(ast_cache_directory.clone()).expect("Failed to create cache directory");

    CacheManager { cache_directory: ast_cache_directory.clone() }
  }

  pub async fn write_ast(&self, file_name: &str, schema: &SchemaAst) -> cacache::Result<Integrity> {
    cacache::write(&self.cache_directory, file_name, serde_json::to_string(schema).unwrap()).await
  }

  pub async fn read_ast(&self, file_name: &str) -> Result<SchemaAst, serde_json::Error> {
    let result = cacache::read(&self.cache_directory, file_name).await;

    serde_json::from_str::<SchemaAst>(
      std::str::from_utf8(&result.expect("Failed to read cached schema file"))
        .expect("Failed to convert cache byte array to String"),
    )
  }
}
