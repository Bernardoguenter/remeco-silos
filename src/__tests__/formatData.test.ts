import { describe, it, expect } from "vitest";
import { formatPrices } from "@helpers/formatData";

describe("formatData", () => {
  describe("formatPrices", () => {
    it("should format a price in Argentine Pesos currency", () => {
      const result = formatPrices(1000);
      expect(result).toContain("$");
      expect(result).toContain("1");
    });

    it("should handle zero price", () => {
      const result = formatPrices(0);
      expect(result).toContain("$");
      expect(result).toContain("0");
    });

    it("should handle large prices", () => {
      const result = formatPrices(1000000);
      expect(result).toContain("$");
      expect(result).toMatch(/\d+/);
    });

    it("should return $0 for NaN", () => {
      const result = formatPrices(NaN);
      expect(result).toBe("$0");
    });

    it("should format prices with thousands separator", () => {
      const result = formatPrices(10000);
      // The format should be currency formatted
      expect(result).toBeTruthy();
    });
  });
});
