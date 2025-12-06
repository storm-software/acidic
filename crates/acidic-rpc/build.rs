use protoc_bin_vendored::protoc_bin_path;
use std::{fs::copy, fs::read_dir, path::Path, path::PathBuf};
use tempfile::Builder;
use tonic_build::configure;

fn main() {
  std::env::set_var("PROTOC", protoc_bin_path().unwrap());

  //   // health-check
  //   let temp_file = codegen(
  //     &["../../proto/storm/acidic/health/v1/health_check.proto"],
  //     &["../../proto"],
  //     &PathBuf::from("./src/generated"),
  //     &PathBuf::from("./src/generated/health_v1.bin"),
  //     true,
  //     true,
  //   );
  //   created_files.extend(temp_file);

  // engine
  codegen(
    &["../../proto/engine.proto"],
    &["../../proto"],
    &PathBuf::from("./src/proto"),
    &PathBuf::from("./src/proto/engine.bin"),
    true,
    true,
  );
}

fn codegen(
  iface_files: &[&str],
  include_dirs: &[&str],
  out_dir: &Path,
  file_descriptor_set_path: &Path,
  build_client: bool,
  build_server: bool,
) {
  let tempdir = Builder::new().prefix("codegen").tempdir().unwrap();

  configure()
    .protoc_arg("--experimental_allow_proto3_optional")
    .build_client(build_client)
    .build_server(build_server)
    .out_dir(tempdir.as_ref())
    .file_descriptor_set_path(file_descriptor_set_path)
    .compile(&iface_files, &include_dirs)
    .unwrap();

  for path in read_dir(tempdir.path()).unwrap() {
    let path = path.unwrap().path();
    let to = out_dir.join(
      path.file_name().unwrap().to_str().unwrap().strip_suffix(".rs").unwrap().replace('.', "_")
        + ".rs",
    );

    copy(&path, &to).unwrap();
  }
  tempdir.close().unwrap();
}
