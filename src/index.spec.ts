import { describe, expect, it } from "vitest";
import * as typer from "./index.js";

const invalidTypes = [
  " ",
  "null",
  "undefined",
  "/",
  "text/;plain",
  'text/"plain"',
  "text/p£ain",
  "text/(plain)",
  "text/@plain",
  "text/plain,wrong",
];

describe("typer.format", () => {
  it("should format basic type", () => {
    const str = typer.format({ type: "text", subtype: "html" });
    expect(str).toBe("text/html");
  });

  it("should format type with suffix", () => {
    const str = typer.format({ type: "image", subtype: "svg", suffix: "xml" });
    expect(str).toBe("image/svg+xml");
  });

  it("should require argument", () => {
    expect(() => typer.format(undefined as never)).toThrow(/obj.*required/);
  });

  it("should reject non-objects", () => {
    expect(() => typer.format(7 as never)).toThrow(/obj.*required/);
  });

  it("should require type", () => {
    expect(() => typer.format({} as never)).toThrow(/invalid type/);
  });

  it("should reject invalid type", () => {
    expect(() => typer.format({ type: "text/", subtype: "html" })).toThrow(
      /invalid type/,
    );
  });

  it("should require subtype", () => {
    expect(() => typer.format({ type: "text" } as never)).toThrow(
      /invalid subtype/,
    );
  });

  it("should reject invalid subtype", () => {
    const obj = { type: "text", subtype: "html/" };
    expect(() => typer.format(obj)).toThrow(/invalid subtype/);
  });

  it("should reject invalid suffix", () => {
    const obj = { type: "image", subtype: "svg", suffix: "xml\\" };
    expect(() => typer.format(obj)).toThrow(/invalid suffix/);
  });
});

describe("typer.parse", () => {
  it("should parse basic type", () => {
    const type = typer.parse("text/html");
    expect(type.type).toBe("text");
    expect(type.subtype).toBe("html");
  });

  it("should parse with suffix", () => {
    const type = typer.parse("image/svg+xml");
    expect(type.type).toBe("image");
    expect(type.subtype).toBe("svg");
    expect(type.suffix).toBe("xml");
  });

  it("should lower-case type", () => {
    const type = typer.parse("IMAGE/SVG+XML");
    expect(type.type).toBe("image");
    expect(type.subtype).toBe("svg");
    expect(type.suffix).toBe("xml");
  });

  invalidTypes.forEach((type) => {
    it(`should throw on invalid media type ${JSON.stringify(type)}`, () => {
      expect(() => typer.parse(type)).toThrow(/invalid media type/);
    });
  });

  it("should require argument", () => {
    expect(() => typer.parse(undefined as never)).toThrow(/string.*required/);
  });

  it("should reject non-strings", () => {
    expect(() => typer.parse(7 as never)).toThrow(/string.*required/);
  });
});

describe("typer.test", () => {
  it("should pass basic type", () => {
    expect(typer.test("text/html")).toBe(true);
  });

  it("should pass with suffix", () => {
    expect(typer.test("image/svg+xml")).toBe(true);
  });

  it("should pass upper-case type", () => {
    expect(typer.test("IMAGE/SVG+XML")).toBe(true);
  });

  invalidTypes.forEach((type) => {
    it(`should fail invalid media type ${JSON.stringify(type)}`, () => {
      expect(typer.test(type)).toBe(false);
    });
  });

  it("should require argument", () => {
    expect(() => typer.test(undefined as never)).toThrow(/string.*required/);
  });

  it("should reject non-strings", () => {
    expect(() => typer.test(7 as never)).toThrow(/string.*required/);
  });
});
