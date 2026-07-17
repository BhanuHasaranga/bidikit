import { describe, it, expect, beforeEach } from "vitest";
import { getDirection, isRTLLanguage, DirectionManager } from "../src/direction.js";

describe("isRTLLanguage", () => {
  it("returns true for Arabic", () => {
    expect(isRTLLanguage("ar")).toBe(true);
  });

  it("returns true for Hebrew", () => {
    expect(isRTLLanguage("he")).toBe(true);
  });

  it("returns true for Persian", () => {
    expect(isRTLLanguage("fa")).toBe(true);
  });

  it("returns true for Urdu", () => {
    expect(isRTLLanguage("ur")).toBe(true);
  });

  it("returns false for English", () => {
    expect(isRTLLanguage("en")).toBe(false);
  });

  it("returns false for French", () => {
    expect(isRTLLanguage("fr")).toBe(false);
  });

  it("returns true for base language of ar-SA", () => {
    expect(isRTLLanguage("ar-SA")).toBe(true);
  });

  it("uses custom RTL language set when provided", () => {
    const custom = new Set(["xx"]);
    expect(isRTLLanguage("xx", custom)).toBe(true);
    expect(isRTLLanguage("ar", custom)).toBe(false);
  });
});

describe("getDirection", () => {
  it("returns rtl for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
  });

  it("returns ltr for English", () => {
    expect(getDirection("en")).toBe("ltr");
  });
});

describe("DirectionManager", () => {
  let manager: DirectionManager;

  beforeEach(() => {
    manager = new DirectionManager({
      autoDirection: false, // disable DOM mutations in tests
    });
  });

  it("defaults to ltr", () => {
    expect(manager.direction).toBe("ltr");
    expect(manager.isRTL).toBe(false);
    expect(manager.isLTR).toBe(true);
  });

  it("updates direction on apply(ar)", () => {
    manager.apply("ar");
    expect(manager.direction).toBe("rtl");
    expect(manager.isRTL).toBe(true);
    expect(manager.isLTR).toBe(false);
    expect(manager.language).toBe("ar");
  });

  it("updates direction on apply(en)", () => {
    manager.apply("ar");
    manager.apply("en");
    expect(manager.direction).toBe("ltr");
  });

  it("supports custom RTL languages", () => {
    const m = new DirectionManager({
      rtlLanguages: ["xx"],
      autoDirection: false,
    });
    m.apply("xx");
    expect(m.isRTL).toBe(true);
  });
});
