use directories::ProjectDirs;
use std::collections::HashMap;
use storm_config::{Config, ConfigError, Environment, File, Value};
use storm_workspace::utils::get_workspace_root;

/// The Acidic configuration values that can be set in the acidic.json config file
#[derive(Debug, Clone)]
pub struct AcidicConfig {
  /// The root directory of the workspace
  pub workspace_root: String,

  /// The default options for all plugins
  pub default_options: Option<HashMap<String, Value>>,

  /// The base output directory where the generated code/artifacts will be written to
  ///
  /// ## default
  /// "node_modules/.acidic"
  ///
  pub output_path: String,

  /// The Acidic cache directory where cached file data will be written to and read from
  ///
  /// **Note:** This value will be generated using the `cache_directory` option in the base of the Storm config file if not explicitly provided in the Acidic configuration
  ///
  /// ## default
  /// "node_modules/.cache/acidic"
  ///
  pub cache_directory: String,

  /// A path to the input file(s) to be used by the engine. The expected value type is a glob pattern string.
  ///
  /// ## default
  /// "**\/*.acid"
  ///
  pub input: Vec<String>,

  /// A path(s) to the file(s) to be ignored by the engine. This can be a glob pattern or an array of glob patterns.
  ///
  /// ## default
  /// [ "**\/node_modules/**", "**\/dist/**","**\/.git/**", "**\/.idea/**", "**\/.vscode/**", "**\/build/**", "**\/coverage/**", "**\/tmp/**" ]
  ///
  pub ignored: Vec<String>,

  /// The underlying configuration object
  pub config: Option<Config>,
}

impl AcidicConfig {
  pub fn new(workspace_root: Option<&str>) -> Result<Self, ConfigError> {
    let mut acidic_config = AcidicConfig::default_with_workspace_root(workspace_root);

    acidic_config.config = Some(
      Config::builder()
        .set_default("default_options", acidic_config.default_options.clone())?
        .set_default("output_path", acidic_config.output_path.clone())?
        .set_default("cache_directory", acidic_config.cache_directory.clone())?
        .set_default("input", acidic_config.input.clone())?
        .set_default("ignored", acidic_config.ignored.clone())?
        .add_source(
          File::with_name(&format!("{}/acidic.json", acidic_config.workspace_root)).required(false),
        )
        .add_source(
          File::with_name(&format!("{}/.storm/acidic.json", acidic_config.workspace_root))
            .required(false),
        )
        .add_source(
          File::with_name(&format!("{}/acidic.toml", acidic_config.workspace_root)).required(false),
        )
        .add_source(
          File::with_name(&format!("{}/.storm/acidic.toml", acidic_config.workspace_root))
            .required(false),
        )
        .add_source(
          File::with_name(&format!("{}/acidic.yaml", acidic_config.workspace_root)).required(false),
        )
        .add_source(
          File::with_name(&format!("{}/.storm/acidic.yaml", acidic_config.workspace_root))
            .required(false),
        )
        .add_source(Environment::with_prefix("acidic"))
        .build()?,
    );

    let config = acidic_config.config.as_ref().unwrap();
    if let Ok(found) = config.get_table("default_options") {
      acidic_config.default_options = Some(found);
    }
    if let Ok(found) = config.get_string("output_path") {
      acidic_config.output_path = found;
    }
    if let Ok(found) = config.get_string("cache_directory") {
      acidic_config.cache_directory = found;
    }
    if let Ok(found) = config.get_array("input") {
      acidic_config.input = found.iter().map(|v| v.to_string()).collect();
    }
    if let Ok(found) = config.get_array("ignored") {
      acidic_config.ignored = found.iter().map(|v| v.to_string()).collect();
    }

    Ok(acidic_config)
  }

  pub fn default_with_workspace_root(workspace_root: Option<&str>) -> AcidicConfig {
    let mut default_config = AcidicConfig::default();

    match workspace_root {
      Some(workspace_root) => {
        default_config.workspace_root = workspace_root.to_owned();

        default_config
      }
      None => default_config,
    }
  }
}

impl Default for AcidicConfig {
  fn default() -> AcidicConfig {
    let workspace_root = get_workspace_root().expect("No workspace root could be found");

    AcidicConfig {
      workspace_root: workspace_root.to_string_lossy().to_string(),
      default_options: None,
      output_path: "node_modules/.acidic".to_string(),
      cache_directory: ProjectDirs::from("org", "Storm Software", "Acidic")
        .expect("Failed to determine default cache directory")
        .cache_dir()
        .to_string_lossy()
        .to_string(),
      input: vec!["**/*.acid".to_string()],
      ignored: vec![
        "**/node_modules/**".to_string(),
        "**/dist/**".to_string(),
        "**/.git/**".to_string(),
        "**/.idea/**".to_string(),
        "**/.vscode/**".to_string(),
        "**/build/**".to_string(),
        "**/coverage/**".to_string(),
        "**/tmp/**".to_string(),
      ],
      config: None,
    }
  }
}
