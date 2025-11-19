import { describe, it, expect } from "vitest";
import { getSiloPrice } from "@helpers/calculatePrice";
import type { Preferences, Silo } from "../types/types";

describe("calculatePrice", () => {
  describe("getSiloPrice", () => {
    const mockPreferences: Preferences = {
      company_id: "test-company",
      feeder_silos: {
        silo1: 100,
        silo2: 150,
      },
      airbase_silos: {
        aerial1: 200,
        aerial2: 250,
      },
      dollar_quote: 850,
      iva_percentage: 21,
      default_markup: 1,
      cone_base_45: 10,
      cone_base_55: 20,
    };

    const mockFeederSilo: Silo = {
      id: 1,
      silo_type: "comederos",
      name: "silo1",
      description: "Test Silo",
      image_url: "/test.jpg",
      has_options: false,
      options: {},
    };

    const mockAirsilo: Silo = {
      id: 2,
      silo_type: "aereos",
      name: "aerial1",
      description: "Test Aerial Silo",
      image_url: "/test.jpg",
      has_options: false,
      options: {},
    };

    it("should calculate price for feeder silo", () => {
      const price = getSiloPrice("silo1", mockPreferences, mockFeederSilo);
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe("number");
    });

    it("should calculate price for airbase silo", () => {
      const price = getSiloPrice("aerial1", mockPreferences, mockAirsilo);
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe("number");
    });

    it("should return 0 for unknown silo type", () => {
      const unknownSilo: Silo = {
        id: 3,
        silo_type: "unknown",
        name: "test",
        description: "Unknown silo",
        image_url: "/test.jpg",
        has_options: false,
        options: {},
      };
      const price = getSiloPrice("test", mockPreferences, unknownSilo);
      expect(price).toBe(0);
    });

    it("should return 0 if preferences is null", () => {
      const price = getSiloPrice("silo1", null as any, mockFeederSilo);
      expect(price).toBe(0);
    });

    it("should apply markup to the price", () => {
      const priceWithMarkup = getSiloPrice(
        "silo1",
        mockPreferences,
        mockFeederSilo
      );
      const priceWithoutMarkup = getSiloPrice(
        "silo1",
        { ...mockPreferences, default_markup: 0 },
        mockFeederSilo
      );
      expect(priceWithMarkup).toBeGreaterThan(priceWithoutMarkup);
    });

    it("should handle IVA percentage correctly", () => {
      const priceWithIva = getSiloPrice(
        "silo1",
        mockPreferences,
        mockFeederSilo
      );
      const priceWithoutIva = getSiloPrice(
        "silo1",
        { ...mockPreferences, iva_percentage: 0 },
        mockFeederSilo
      );
      expect(priceWithIva).toBeLessThan(priceWithoutIva);
    });
  });
});
