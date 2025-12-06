#![doc = include_str!("../README.md")]
#![allow(clippy::derive_partial_eq_without_eq)]

pub mod ast;
pub mod parser;
pub mod types;
pub mod utils;

#[cfg(test)]
mod tests {
  use crate::utils::parse_schema::parse_schema;
  use acidic_diagnostics::Diagnostics;

  #[test]
  fn parse_file() {
    let service = parse_schema(
      r#"
    import "../enums.prisma"
    import "../models.prisma"

    datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
      }

      generator js {
        provider = "prisma-client-js"
        /// Generate into custom location because this repo has multiple prisma schemas
        output   = "../../../../../node_modules/@prisma/client/contact-attachment"
      }

      plugin entityFields {
      provider = "@stormstack/tools-forecast-plugins-entity-fields"
      idFormat = "snowflake"
      }

      plugin crud {
      provider = "@stormstack/tools-forecast-plugins-crud"
      }

      plugin drizzle {
      provider = "@stormstack/tools-forecast-plugins-drizzle"
      output = "drizzle"
      compile = false
      }

      plugin valibot {
      provider = "@stormstack/tools-forecast-plugins-valibot"
      output = "valibot"
      compile = false
      }

      enum ContactReason {
        Business
        Question
        Other
        Project
        Interest
        Subscribe
      }

      enum AttachmentStatus {
        Pending
        Approved
        Rejected
        Removed
      }

      model Contact {
        /// The unique identifier for the Contact
        id String @id @default(snowflake())

        /// The reason of the Contact
        reason ContactReason @default(Other)

        /// The details of the Contact
        details String? @length(1, 100)

        /// The provided email to respond back to the Contact request
        email String @email

        /// The provided phone number to respond back to the Contact request
        phoneNumber String? @phoneNumber @length(1, 20)

        /// The provided first name of the Contact
        firstName String? @length(1, 50)

        /// The provided first name of the Contact
        lastName String? @length(1, 50)

        /// The provided address of the Contact
        addressLine1 String? @length(1, 100)

        /// The provided address of the Contact
        addressLine2 String? @length(1, 100)

        /// The provided postal code of the Contact
        postalCode String? @postalCode @length(1, 20)

        /// The provided city of the Contact
        city String? @length(1, 50)

        /// The provided state of the Contact
        state String? @length(1, 50)

        /// The provided country code of the Contact
        countryCode String? @countryCode @length(1, 2)

        /// The provided title of the Contact
        title String? @length(1, 50)

        /// The provided company name of the Contact
        companyName String? @length(1, 50)

        /// The provided URL of the Contact
        url String? @url

        /// A list of file attachments included by the Contact
        attachments ContactAttachment[]

        /// everyone can send contact data
        @@allow('create,update,delete,read', true)
      }

      model ContactAttachment {
        /// The name of the file
        name String @length(1, 100)

        /// The path of the file
        path String @url @length(1, 100)

        /// The status of the file
        status AttachmentStatus @default(Pending)

        /// The Contact the attachment belongs to
        contact Contact @relation(fields: [contactId], references: [id])

        /// The Contact (Id) the attachment belongs to
        contactId String

        /// everyone can send contact data
        @@allow('create,update,delete,read', true)

        @@unique([name, path])
      }

    "#,
      &mut Diagnostics::new(),
    );

    assert_eq!(service.imports.len(), 2);
    assert_eq!(service.data_sources.len(), 1);
    assert_eq!(service.plugins.len(), 5);
    assert_eq!(service.models.len(), 2);
    assert_eq!(service.enumerations.len(), 2);
  }

  #[test]
  fn parse_import() {
    let service = parse_schema(
      r#"
      import "../first.prisma"
      import Second from "../second.prisma"
    "#,
      &mut Diagnostics::new(),
    );

    assert_eq!(service.imports.len(), 2);
    assert_eq!(
      service.imports.get(0).expect("Import statement is missing from Schema AST").path,
      "../first.prisma".to_string()
    );
    assert_eq!(
      service.imports.get(1).expect("Import statement is missing from Schema AST").id,
      Some("Second".to_string())
    );
    assert_eq!(
      service.imports.get(1).expect("Import statement is missing from Schema AST").path,
      "../second.prisma".to_string()
    );
  }

  #[test]
  fn parse_data_source() {
    let service = parse_schema(
      "
    datasource db {
        provider = \"sqlite\"
        url      = \"file:./url.db\"
        direct_url = \"file:./direct_url.db\"
        shadow_database_url = \"file:./shadow_database_url.db\"
      }
    ",
      &mut Diagnostics::new(),
    );

    assert_eq!(service.data_sources.len(), 1);
    assert_eq!(service.data_sources["db"].id, "db");
    assert_eq!(
      service.data_sources["db"].properties["provider"].as_string(),
      Some("sqlite".to_string()).as_ref()
    );
    assert_eq!(
      service.data_sources["db"].properties["url"].as_string(),
      Some("file:./url.db".to_string()).as_ref()
    );
    assert_eq!(
      service.data_sources["db"].properties["direct_url"].as_string(),
      Some("file:./direct_url.db".to_string()).as_ref()
    );
    assert_eq!(
      service.data_sources["db"].properties["shadow_database_url"].as_string(),
      Some("file:./shadow_database_url.db".to_string()).as_ref()
    );
  }

  #[test]
  fn parse_plugin() {
    let service = parse_schema(
      "
      plugin js-plugin {
        provider = \"prisma-client-js\"
        output   = \"../../../../../node_modules/@prisma/client/contact-attachment\"
      }
    ",
      &mut Diagnostics::new(),
    );

    assert_eq!(service.plugins.len(), 1);
    assert_eq!(service.plugins["js-plugin"].id, "js-plugin");
    assert_eq!(
      service.plugins["js-plugin"].properties["provider"].as_string(),
      Some("prisma-client-js".to_string()).as_ref()
    );
    assert_eq!(
      service.plugins["js-plugin"].properties["output"].as_string(),
      Some("../../../../../node_modules/@prisma/client/contact-attachment".to_string()).as_ref()
    );
  }

  #[test]
  fn parse_enum() {
    let service = parse_schema(
      "
      enum ContactReason {
        Business
        Question
        Other
        Project
        Interest
        Subscribe
      }
        ",
      &mut Diagnostics::new(),
    );

    assert_eq!(service.enumerations.len(), 1);
    assert_eq!(service.enumerations["ContactReason"].id, "ContactReason");
    assert_eq!(service.enumerations["ContactReason"].values.len(), 6);
    assert_eq!(service.enumerations["ContactReason"].values["Business"].id, "Business");
    assert_eq!(service.enumerations["ContactReason"].values["Question"].id, "Question");
    assert_eq!(service.enumerations["ContactReason"].values["Other"].id, "Other");
    assert_eq!(service.enumerations["ContactReason"].values["Project"].id, "Project");
    assert_eq!(service.enumerations["ContactReason"].values["Interest"].id, "Interest");
    assert_eq!(service.enumerations["ContactReason"].values["Subscribe"].id, "Subscribe");
  }

  #[test]
  fn parse_model() {
    let service = parse_schema(
      "
      model Contact {
        /// The unique identifier for the Contact
        id String @id @default(snowflake())
        reason ContactReason @default(Other)
        details String? @length(1, 100)
        email String @email
        phoneNumber String? @phoneNumber @length(1, 20)
        firstName String? @length(1, 50)
        lastName String? @length(1, 50)
        addressLine1 String? @length(1, 100)
        addressLine2 String? @length(1, 100)
        postalCode String? @postalCode @length(1, 20)
        city String? @length(1, 50)
        state String? @length(1, 50)
        countryCode String? @countryCode @length(1, 2)
        title String? @length(1, 50)
        companyName String? @length(1, 50)
        url String? @url
        attachments ContactAttachment[]

        @@allow('create,update,delete,read', true)
      }
        ",
      &mut Diagnostics::new(),
    );

    assert_eq!(service.models.len(), 1);
    assert_eq!(service.models["Contact"].id, "Contact");
    assert_eq!(service.definitions["Contact"].fields.len(), 17);
    assert_eq!(
      service.definitions["Contact"].fields["id"].comments.first().unwrap(),
      "The unique identifier for the Contact"
    );
  }
}
