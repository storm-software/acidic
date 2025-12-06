// use super::server::AcidicEngineServer;
// use acidic_server::{Engine, EngineServer, GetConfigRequest, GetConfigResponse};
// use tokio::time::Duration;
// use tonic_health::server::HealthReporter;

// pub(crate) async fn engine_health_check(mut reporter: HealthReporter) {
//   loop {
//     tokio::time::sleep(Duration::from_secs(2)).await;

//     reporter.set_serving::<EngineServer<AcidicEngineServer>>().await;
//   }
// }
