import { LangiumParser, LangiumServices, prepareLangiumParser } from "langium";

/**
 * Create and finalize a Langium parser. The parser rules are derived from the grammar, which is
 * available at `services.Grammar`.
 */
export function createAcidicParser(services: LangiumServices): LangiumParser {
  const parser = prepareAcidicParser(services);
  parser.finalize();

  return parser;
}

/**
 * Create a Langium parser without finalizing it. This is used to extract more detailed error
 * information when the parser is initially validated.
 */
export function prepareAcidicParser(services: LangiumServices): LangiumParser {
  services.parser.ParserConfig = { maxLookahead: 3 };
  return prepareLangiumParser(services);
}
