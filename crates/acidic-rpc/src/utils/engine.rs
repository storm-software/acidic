use std::str::FromStr;
use tonic::transport::Uri;

/// Get the engine address from the environment variable ACIDIC_ENGINE_ADDRESS.
///
/// If the environment variable is not set, the default value is "http://[::1]:50051".
///
/// # Example
/// ```rust
/// use acidic_rpc::utils::engine;
///
/// let engine_address_string = get_address_string();
/// ```
pub fn get_address_string() -> String {
  match std::env::var("ACIDIC_ENGINE_ADDRESS") {
    Ok(val) => val,
    Err(_) => "http://[::1]:50051".to_string(),
  }
}

/// Get the engine address from the environment variable ACIDIC_ENGINE_ADDRESS.
///
/// If the environment variable is not set, the default value is "http://[::1]:50051".
///
/// # Example
/// ```rust
/// use acidic_rpc::utils::engine;
///
/// let engine_address = get_address();
/// ```
pub fn get_address() -> Uri {
  Uri::from_str(get_address_string().as_str()).expect("Failed to parse engine address")
}
