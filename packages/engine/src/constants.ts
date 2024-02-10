/**
 * Default length of password hash salt (used by bcryptjs to hash password)
 */
export const DEFAULT_PASSWORD_SALT_LENGTH = 12;

/**
 * Auxiliary database field for supporting policy check for nested writes
 */
export const TRANSACTION_FIELD_NAME = "acidic_transaction";

/**
 * Auxiliary database field for building up policy check queries
 */
export const GUARD_FIELD_NAME = "acidic_guard";

/**
 * All Auxiliary fields.
 */
export const AUXILIARY_FIELDS = [TRANSACTION_FIELD_NAME, GUARD_FIELD_NAME];

/**
 * Reasons for a CRUD operation to fail
 */
export enum CrudFailureReason {
  /**
   * CRUD succeeded but the result was not readable.
   */
  RESULT_NOT_READABLE = "RESULT_NOT_READABLE",

  /**
   * CRUD failed because of a data validation rule violation.
   */
  DATA_VALIDATION_VIOLATION = "DATA_VALIDATION_VIOLATION"
}

/**
 * Field name for storing in-transaction flag
 */
export const PRISMA_TX_FLAG = "$__acidic_tx";

/**
 * Field name for getting current enhancer
 */
export const ACIDIC_PROXY_ENHANCER = "$__acidic_enhancer";
