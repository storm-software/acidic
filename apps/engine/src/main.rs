#![doc = include_str!("../README.md")]
#![deny(rust_2018_idioms, unsafe_code)]
#![allow(clippy::needless_collect)] // the implementation of that rule is way too eager, it rejects necessary collects
#![allow(clippy::derive_partial_eq_without_eq)]

// use super::{health_check::engine_health_check, server::AcidicEngineServer};
use acidic_rpc::{
  proto::engine::engine_server::EngineServer, server::EngineService, utils::engine::get_address,
};
use tonic::transport::Server;
// use tonic_health::server::HealthReporter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  tracing_subscriber::fmt::init();

  let addr = get_address();
  println!("EngineServer listening on {}", addr);

  //   let (mut health_reporter, health_service) = tonic_health::server::health_reporter();
  //   health_reporter.set_serving::<EngineServer<AcidicEngineServer>>().await;

  //   tokio::spawn(engine_health_check(health_reporter.clone()));

  Server::builder()
    .accept_http1(true)
    .add_service(tonic_web::enable(EngineServer::new(EngineService::default())))
    // .add_service(health_service)
    .serve(addr.to_string().parse()?)
    .await?;

  Ok(())
}
