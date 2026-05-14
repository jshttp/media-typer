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

  it("should maintain case", () => {
    const str = typer.format({ type: "Text", subtype: "Html" });
    expect(str).toBe("Text/Html");
  });

  it("should allow + in subtype", () => {
    const str = typer.format({ type: "application", subtype: "vnd.api+json" });
    expect(str).toBe("application/vnd.api+json");
  });

  it("should require type", () => {
    expect(() => typer.format({} as never)).toThrow(/Invalid type/);
  });

  it("should reject invalid type", () => {
    expect(() => typer.format({ type: "text/", subtype: "html" })).toThrow(
      /Invalid type/,
    );
  });

  it("should require subtype", () => {
    expect(() => typer.format({ type: "text" } as never)).toThrow(
      /Invalid subtype/,
    );
  });

  it("should reject invalid subtype", () => {
    const obj = { type: "text", subtype: "html/" };
    expect(() => typer.format(obj)).toThrow(/Invalid subtype/);
  });

  it("should reject empty suffix", () => {
    const obj = { type: "text", subtype: "html", suffix: "" };
    expect(() => typer.format(obj)).toThrow(/Invalid suffix/);
  });

  it("should reject invalid suffix", () => {
    const obj = { type: "image", subtype: "svg", suffix: "xml\\" };
    expect(() => typer.format(obj)).toThrow(/Invalid suffix/);
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

  it("should parse with multiple + in subtype", () => {
    const type = typer.parse("application/vnd.api+json+gzip");
    expect(type.type).toBe("application");
    expect(type.subtype).toBe("vnd.api+json");
    expect(type.suffix).toBe("gzip");
  });

  invalidTypes.forEach((type) => {
    it(`should throw on invalid media type ${JSON.stringify(type)}`, () => {
      expect(() => typer.parse(type)).toThrow(/Invalid media type/);
    });
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
});
