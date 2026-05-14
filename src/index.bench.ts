import { bench, describe } from "vitest";
import * as typer from "./index.js";

describe("typer.format", () => {
  bench("basic type", () => {
    typer.format({ type: "text", subtype: "html" });
  });

  bench("type with suffix", () => {
    typer.format({ type: "image", subtype: "svg", suffix: "xml" });
  });
});

describe("typer.parse", () => {
  bench("basic type", () => {
    typer.parse("text/html");
  });

  bench("type with suffix", () => {
    typer.parse("image/svg+xml");
  });

  bench("upper-case type with suffix", () => {
    typer.parse("IMAGE/SVG+XML");
  });
});

describe("typer.test", () => {
  bench("basic type", () => {
    typer.test("text/html");
  });

  bench("type with suffix", () => {
    typer.test("image/svg+xml");
  });

  bench("invalid type", () => {
    typer.test("text/plain,wrong");
  });
});
