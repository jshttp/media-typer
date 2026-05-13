/**
 * RegExp to match type in RFC 6838
 *
 * type-name = restricted-name
 * subtype-name = restricted-name
 * restricted-name = restricted-name-first *126restricted-name-chars
 * restricted-name-first  = ALPHA / DIGIT
 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
 *                          "$" / "&" / "-" / "^" / "_"
 * restricted-name-chars =/ "." ; Characters before first dot always
 *                              ; specify a facet name
 * restricted-name-chars =/ "+" ; Characters after last plus always
 *                              ; specify a structured syntax suffix
 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
 * DIGIT =  %x30-39             ; 0-9
 */
const subtypeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
const typeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
const typeRegExp =
  /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

/**
 * Media type object.
 */
export interface MediaType {
  /**
   * The type of the media type.
   */
  type: string;
  /**
   * The subtype of the media type.
   */
  subtype: string;
  /**
   * The structured syntax suffix of the media type.
   */
  suffix?: string;
}

/**
 * Format object to media type.
 */
export function format(obj: MediaType): string {
  if (!obj || typeof obj !== "object") {
    throw new TypeError("argument obj is required");
  }

  const subtype = obj.subtype;
  const suffix = obj.suffix;
  const type = obj.type;

  if (!type || !typeNameRegExp.test(type)) {
    throw new TypeError("invalid type");
  }

  if (!subtype || !subtypeNameRegExp.test(subtype)) {
    throw new TypeError("invalid subtype");
  }

  let str = type + "/" + subtype;

  if (suffix) {
    if (!typeNameRegExp.test(suffix)) {
      throw new TypeError("invalid suffix");
    }

    str += "+" + suffix;
  }

  return str;
}

/**
 * Parse media type to object.
 */
export function parse(str: string): MediaType {
  if (!str) {
    throw new TypeError("argument string is required");
  }

  if (typeof str !== "string") {
    throw new TypeError("argument string is required to be a string");
  }

  const match = typeRegExp.exec(str.toLowerCase());

  if (!match) {
    throw new TypeError("invalid media type");
  }

  const type = match[1];
  let subtype = match[2];
  let suffix: string | undefined;

  const index = subtype.lastIndexOf("+");
  if (index !== -1) {
    suffix = subtype.slice(index + 1);
    subtype = subtype.slice(0, index);
  }

  return { type, subtype, suffix };
}

/**
 * Test media type.
 */
export function test(str: string): boolean {
  if (!str) {
    throw new TypeError("argument string is required");
  }

  if (typeof str !== "string") {
    throw new TypeError("argument string is required to be a string");
  }

  return typeRegExp.test(str.toLowerCase());
}
