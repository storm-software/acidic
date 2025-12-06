use crate::{
  pretty_print::{pretty_print, DiagnosticColorer},
  Span,
};
use colored::{ColoredString, Colorize};
use indoc::indoc;

/// A non-fatal warning emitted by the schema parser.
/// For fancy printing, please use the `pretty_print_error` function.
#[derive(Debug, PartialEq, Eq, Clone)]
pub struct SchemaWarning {
  message: String,
  span: Span,
}

impl SchemaWarning {
  /// You should avoid using this constructor directly when possible, and define warnings as public methods of this class.
  /// The constructor is only left public for supporting connector-specific warnings (which should not live in the core).
  pub fn new(message: String, span: Span) -> SchemaWarning {
    SchemaWarning { message, span }
  }

  pub fn new_feature_deprecated(feature: &str, span: Span) -> SchemaWarning {
    let message = format!(
            "Preview feature \"{feature}\" is deprecated. The functionality can be used without specifying it as a preview feature."
        );
    Self::new(message, span)
  }

  pub fn new_referential_integrity_attr_deprecation_warning(span: Span) -> SchemaWarning {
    let message = "The `referentialIntegrity` attribute is deprecated. Please use `relationMode` instead. Learn more at https://pris.ly/d/relation-mode";
    Self::new(message.to_string(), span)
  }

  pub fn new_missing_index_on_emulated_relation(span: Span) -> SchemaWarning {
    let message = indoc!(
            r#"
            With `relationMode = "prisma"`, no foreign keys are used, so relation fields will not benefit from the index usually created by the relational database under the hood.
            This can lead to poor performance when querying these fields. We recommend adding an index manually.
            Learn more at https://pris.ly/d/relation-mode-prisma-indexes"
            "#,
        )
        .replace('\n', " ");
    Self::new(message, span)
  }

  pub fn new_field_validation(
    message: &str,
    model: &str,
    field: &str,
    span: Span,
  ) -> SchemaWarning {
    let msg = format!(
      "Warning validating field `{}` in {} `{}`: {}",
      field, "model", model, message
    );

    Self::new(msg, span)
  }

  /// The user-facing warning message.
  pub fn message(&self) -> &str {
    &self.message
  }

  /// The source span the warning applies to.
  pub fn span(&self) -> Span {
    self.span
  }

  pub fn pretty_print(
    &self,
    f: &mut dyn std::io::Write,
    file_name: &str,
    text: &str,
  ) -> std::io::Result<()> {
    pretty_print(
      f,
      file_name,
      text,
      self.span(),
      self.message.as_ref(),
      &SchemaWarningColorer {},
    )
  }
}

struct SchemaWarningColorer {}

impl DiagnosticColorer for SchemaWarningColorer {
  fn title(&self) -> &'static str {
    "warning"
  }

  fn primary_color(&self, token: &'_ str) -> ColoredString {
    token.bright_yellow()
  }
}
