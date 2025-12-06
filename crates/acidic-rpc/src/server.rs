use super::proto::engine::engine_server::Engine;
use super::proto::engine::{InitializeRequest, InitializeResponse};
use tonic::{Request, Response, Status};

#[derive(Default)]
pub struct EngineService {}

#[tonic::async_trait]
impl Engine for EngineService {
  // our rpc impelemented as function
  async fn initialize(
    &self,
    request: Request<InitializeRequest>,
  ) -> Result<Response<InitializeResponse>, Status> {
    // returning a response as InitializeResponse message as defined in .proto
    Ok(Response::new(InitializeResponse {
      // reading data from request which is awrapper around our InitializeRequest message defined in .proto
      schemas: vec![],
    }))
  }
}
