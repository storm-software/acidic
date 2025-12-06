use super::proto::engine::engine_client;
use super::proto::engine::{InitializeRequest, InitializeResponse};
use crate::utils::engine::get_address;
use std::path::PathBuf;
use tonic::transport::channel::Channel;
use tonic::{Request, Response, Status};

pub struct EngineClient {
  client: engine_client::EngineClient<Channel>,
}

impl EngineClient {
  pub async fn create() -> Result<Self, Box<dyn std::error::Error>> {
    Ok(EngineClient {
      client: engine_client::EngineClient::new(Channel::builder(get_address()).connect().await?),
    })
  }

  pub async fn initialize(
    &mut self,
    workspace_root: &PathBuf,
  ) -> Result<Response<InitializeResponse>, Status> {
    self
      .client
      .initialize(Request::new(InitializeRequest {
        workspace_root: workspace_root.to_string_lossy().to_string(),
      }))
      .await
  }
}
