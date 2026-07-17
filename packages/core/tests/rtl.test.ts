import { describe, it, expect } from "vitest";
import { isDirectionalIcon, shouldMirrorIcon, getDirectionalAnimation, getMirrorTransform, getLogicalSide } from "../src/rtl.js";

describe("isDirectionalIcon", () => {
  it("returns true for arrow-right", () => {
    expect(isDirectionalIcon("arrow-right")).toBe(true);
  });

  it("returns true for chevron-left", () => {
    expect(isDirectionalIcon("chevron-left")).toBe(true);
  });

  it("returns false for heart", () => {
    expect(isDirectionalIcon("heart")).toBe(false);
  });

  it("returns false for star", () => {
    expect(isDirectionalIcon("star")).toBe(false);
  });

  it("uses custom icon set", () => {
    const custom = new Set(["my-icon"]);
    expect(isDirectionalIcon("my-icon", custom)).toBe(true);
    expect(isDirectionalIcon("arrow-right", custom)).toBe(false);
  });
});

describe("shouldMirrorIcon", () => {
  it("returns true for arrow-right in rtl", () => {
    expect(shouldMirrorIcon("arrow-right", "rtl")).toBe(true);
  });

  it("returns false for arrow-right in ltr", () => {
    expect(shouldMirrorIcon("arrow-right", "ltr")).toBe(false);
  });

  it("returns false for heart in rtl", () => {
    expect(shouldMirrorIcon("heart", "rtl")).toBe(false);
  });
});

describe("getDirectionalAnimation", () => {
  it("mirrors slide-left to slide-right in rtl", () => {
    expect(getDirectionalAnimation("slide-left", "rtl")).toBe("slide-right");
  });

  it("mirrors slide-right to slide-left in rtl", () => {
    expect(getDirectionalAnimation("slide-right", "rtl")).toBe("slide-left");
  });

  it("returns same animation in ltr", () => {
    expect(getDirectionalAnimation("slide-left", "ltr")).toBe("slide-left");
  });

  it("mirrors drawer-left to drawer-right in rtl", () => {
    expect(getDirectionalAnimation("drawer-left", "rtl")).toBe("drawer-right");
  });
});

describe("getMirrorTransform", () => {
  it("returns scaleX(-1) when isRTL", () => {
    expect(getMirrorTransform(true)).toBe("scaleX(-1)");
  });

  it("returns none when not RTL", () => {
    expect(getMirrorTransform(false)).toBe("none");
  });
});

describe("getLogicalSide", () => {
  it("maps left to start in ltr", () => {
    expect(getLogicalSide("left", "ltr")).toBe("start");
  });

  it("maps right to end in ltr", () => {
    expect(getLogicalSide("right", "ltr")).toBe("end");
  });

  it("maps left to end in rtl", () => {
    expect(getLogicalSide("left", "rtl")).toBe("end");
  });

  it("maps right to start in rtl", () => {
    expect(getLogicalSide("right", "rtl")).toBe("start");
  });
});
