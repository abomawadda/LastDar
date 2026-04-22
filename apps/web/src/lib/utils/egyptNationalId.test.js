import { describe, expect, it } from "vitest";
import { parseEgyptianNationalId } from "./egyptNationalId";

describe("parseEgyptianNationalId", () => {
  it("parses a valid national id", () => {
    const result = parseEgyptianNationalId("30001010100013");

    expect(result.isValid).toBe(true);
    expect(result.birthDate).toBe("2000-01-01");
    expect(result.governorateCode).toBe("01");
    expect(result.gender).toBe("male");
  });

  it("rejects invalid national id format", () => {
    const result = parseEgyptianNationalId("123");

    expect(result.isValid).toBe(false);
  });
});

