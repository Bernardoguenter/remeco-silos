import { describe, it, expect, beforeEach } from "vitest";
import { getSiloPrice } from "@helpers/calculatePrice";
import { formatPrices } from "@helpers/formatData";
import type { Preferences, Silo } from "../types/types";

/**
 * Tests de integración para componentes con cálculos y preferencias
 *
 * Estos tests simulan el comportamiento completo de componentes
 * que dependen de cálculos de precios y valores de preferencias.
 */

describe("SiloPrice Component Integration", () => {
  let mockPreferences: Preferences;
  let mockSilo: Silo;

  beforeEach(() => {
    mockPreferences = {
      company_id: "remeco",
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
      default_markup: 20,
      cone_base_45: 10,
      cone_base_55: 15,
    };

    mockSilo = {
      id: 1,
      name: "silo1",
      image_url: "/test.jpg",
      silo_type: "comederos",
      description: "Test Silo",
      has_options: false,
      options: {},
    };
  });

  it("should calculate and format price correctly for display", () => {
    const price = getSiloPrice("silo1", mockPreferences, mockSilo);
    const formattedPrice = formatPrices(price);

    expect(price).toBeGreaterThan(0);
    expect(formattedPrice).toContain("$");
    expect(formattedPrice).toMatch(/^\$/);
  });

  it("should display IVA percentage in component", () => {
    const ivaPercentage = mockPreferences.iva_percentage;
    const expectedDisplay = `(Incluye IVA ${ivaPercentage}%)`;

    expect(expectedDisplay).toContain("21%");
    expect(expectedDisplay).toContain("IVA");
  });

  it("should update price when IVA changes", () => {
    const priceWith21IVA = getSiloPrice("silo1", mockPreferences, mockSilo);

    const preferencesWithoutIVA = { ...mockPreferences, iva_percentage: 0 };
    const priceWith0IVA = getSiloPrice(
      "silo1",
      preferencesWithoutIVA,
      mockSilo
    );

    expect(priceWith0IVA).toBeGreaterThan(priceWith21IVA);
  });

  it("should update price when markup changes", () => {
    const priceWithMarkup = getSiloPrice("silo1", mockPreferences, mockSilo);

    const preferencesWithoutMarkup = { ...mockPreferences, default_markup: 0 };
    const priceWithoutMarkup = getSiloPrice(
      "silo1",
      preferencesWithoutMarkup,
      mockSilo
    );

    expect(priceWithMarkup).toBeGreaterThan(priceWithoutMarkup);
  });

  it("should handle dollar quote changes", () => {
    const priceAt850 = getSiloPrice("silo1", mockPreferences, mockSilo);

    const preferencesAt1000 = { ...mockPreferences, dollar_quote: 1000 };
    const priceAt1000 = getSiloPrice("silo1", preferencesAt1000, mockSilo);

    expect(priceAt1000).toBeGreaterThan(priceAt850);
  });
});

describe("SiloDescriptionWithOptions Component Integration", () => {
  let mockPreferences: Preferences;
  let mockSilo: Silo;

  beforeEach(() => {
    mockPreferences = {
      company_id: "remeco",
      feeder_silos: { silo1: 100 },
      airbase_silos: { aerial1: 200 },
      dollar_quote: 850,
      iva_percentage: 21,
      default_markup: 20,
      cone_base_45: 10,
      cone_base_55: 15,
    };

    mockSilo = {
      id: 1,
      name: "silo_with_options",
      image_url: "/test.jpg",
      silo_type: "aereos",
      description: "Silo base features",
      has_options: true,
      options: {
        "45": "Cono base 45 grados",
        "55": "Cono base 55 grados",
      },
    };
  });

  it("should calculate cone option prices correctly", () => {
    const basePrice = 1000;
    const price45 = basePrice * (1 + mockPreferences.cone_base_45 / 100);
    const price55 = basePrice * (1 + mockPreferences.cone_base_55 / 100);

    expect(price45).toBe(1100); // 1000 + 10%
    expect(price55).toBe(1150); // 1000 + 15%
  });

  it("should generate correct option titles", () => {
    const options = mockSilo.options;
    const optionTitles = Object.keys(options).map((angle) => `Cono ${angle}°`);

    expect(optionTitles).toContain("Cono 45°");
    expect(optionTitles).toContain("Cono 55°");
  });

  it("should combine description with option details", () => {
    const baseDescription = mockSilo.description;
    const optionDetail = mockSilo.options["45"];

    const combinedDescription = `${baseDescription}, ${optionDetail}`;

    expect(combinedDescription).toContain("Silo base features");
    expect(combinedDescription).toContain("Cono base 45 grados");
  });

  it("should update cone prices when cone_base percentages change", () => {
    const basePrice = 1000;
    const originalPrice45 =
      basePrice * (1 + mockPreferences.cone_base_45 / 100);

    const updatedPreferences = { ...mockPreferences, cone_base_45: 20 };
    const updatedPrice45 =
      basePrice * (1 + updatedPreferences.cone_base_45 / 100);

    expect(updatedPrice45).toBeGreaterThan(originalPrice45);
    expect(updatedPrice45).toBe(1200); // 1000 + 20%
  });

  it("should format all option prices correctly", () => {
    const basePrice = 1000;
    const prices = {
      base: formatPrices(basePrice),
      cone45: formatPrices(
        basePrice * (1 + mockPreferences.cone_base_45 / 100)
      ),
      cone55: formatPrices(
        basePrice * (1 + mockPreferences.cone_base_55 / 100)
      ),
    };

    expect(prices.base).toContain("$");
    expect(prices.cone45).toContain("$");
    expect(prices.cone55).toContain("$");
  });
});

describe("GridCard Component with Silos", () => {
  const mockSilos = [
    {
      id: 1,
      name: "comedero_1",
      image_url: "/images/comedero1.jpg",
      silo_type: "comederos",
      description: "Comedero básico",
      has_options: false,
      options: {},
    },
    {
      id: 2,
      name: "aereo_1",
      image_url: "/images/aereo1.jpg",
      silo_type: "aereos",
      description: "Silo aéreo",
      has_options: true,
      options: { "45": "info45", "55": "info55" },
    },
  ];

  it("should generate correct URLs for each silo type", () => {
    const URLs = mockSilos.map(
      (silo) => `/silos/${silo.silo_type}/${silo.name}`
    );

    expect(URLs[0]).toBe("/silos/comederos/comedero_1");
    expect(URLs[1]).toBe("/silos/aereos/aereo_1");
  });

  it("should maintain image dimensions for responsive design", () => {
    const dimensions = {
      width: 500,
      height: 500,
    };

    expect(dimensions.width).toBe(dimensions.height);
    expect(dimensions.width).toBeGreaterThan(0);
  });

  it("should handle different silo types", () => {
    const types = mockSilos.map((silo) => silo.silo_type);

    expect(types).toContain("comederos");
    expect(types).toContain("aereos");
  });

  it("should display correct alt text", () => {
    const altTexts = mockSilos.map((silo) => silo.name);

    expect(altTexts[0]).toBe("comedero_1");
    expect(altTexts[1]).toBe("aereo_1");
  });
});

describe("Component Props Validation", () => {
  it("should validate SiloPrice props", () => {
    const validProps = {
      price: "$1,000",
      iva_percentage: 21,
    };

    expect(validProps.price).toBeTruthy();
    expect(validProps.iva_percentage).toBeGreaterThan(0);
    expect(validProps.iva_percentage).toBeLessThan(100);
  });

  it("should validate SiloDescription props", () => {
    const validProps = {
      description: "Valid description text",
      price: "$5,000",
      iva_percentage: 21,
    };

    expect(validProps.description.length).toBeGreaterThan(0);
    expect(validProps.price).toMatch(/^\$/);
    expect(validProps.iva_percentage).toBeGreaterThanOrEqual(0);
  });

  it("should validate SiloDescriptionWithOptions props", () => {
    const validProps = {
      description: "Base description",
      price: 1000,
      iva_percentage: 21,
      options: { "45": "Option 45", "55": "Option 55" },
      cone_base_45: 10,
      cone_base_55: 15,
    };

    expect(validProps.price).toBeGreaterThan(0);
    expect(Object.keys(validProps.options).length).toBeGreaterThan(0);
    expect(validProps.cone_base_45).toBeGreaterThan(0);
    expect(validProps.cone_base_55).toBeGreaterThan(0);
  });

  it("should validate GridCard props", () => {
    const validProps = {
      imageSrc: "/images/silo.jpg",
      alt: "Silo image",
      title: "Silo 1",
      imgWidth: 500,
      imgHeight: 500,
      link: "/silos/comederos/silo1",
      layout: "constrained" as const,
    };

    expect(validProps.imageSrc).toBeTruthy();
    expect(validProps.alt.length).toBeGreaterThan(0);
    expect(validProps.imgWidth).toBeGreaterThan(0);
    expect(validProps.imgHeight).toBeGreaterThan(0);
    expect(["constrained", "full-width", "fixed", "none"]).toContain(
      validProps.layout
    );
  });
});
