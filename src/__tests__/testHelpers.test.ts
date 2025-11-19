import { describe, it, expect } from "vitest";
import {
  createMockPreferences,
  createMockSilo,
  createMockSiloWithOptions,
  createMockSilos,
  isValidPrice,
  isValidFormattedPrice,
  isValidEmail,
  isValidPhoneNumber,
  isValidSiloLink,
  isValidSiloType,
  isValidImageUrl,
  isValidDescription,
  hasRequiredSiloProps,
  hasRequiredPreferencesProps,
  calculateConePrice,
  calculatePriceWithMarkup,
  calculatePriceWithIVA,
  generateRandomPrice,
  generateTestEmail,
  generateTestPhone,
  generateTestMessage,
  PreferencesBuilder,
  SiloBuilder,
  arePricesEqual,
} from "./testHelpers";

/**
 * Tests que demuestran el uso de test helpers
 * Estos ejemplos pueden ser usados como referencia para escribir nuevos tests
 */

describe("Test Helpers - Fixtures", () => {
  it("should create mock preferences with defaults", () => {
    const prefs = createMockPreferences();

    expect(prefs.company_id).toBe("remeco-test");
    expect(prefs.dollar_quote).toBe(850);
    expect(prefs.iva_percentage).toBe(21);
  });

  it("should create mock preferences with overrides", () => {
    const prefs = createMockPreferences({
      dollar_quote: 1000,
      iva_percentage: 10,
    });

    expect(prefs.dollar_quote).toBe(1000);
    expect(prefs.iva_percentage).toBe(10);
    expect(prefs.company_id).toBe("remeco-test");
  });

  it("should create mock silo", () => {
    const silo = createMockSilo();

    expect(silo.id).toBe(1);
    expect(silo.name).toBe("test-silo");
    expect(silo.silo_type).toBe("comederos");
  });

  it("should create mock silo with overrides", () => {
    const silo = createMockSilo({
      name: "custom-silo",
      silo_type: "aereos",
    });

    expect(silo.name).toBe("custom-silo");
    expect(silo.silo_type).toBe("aereos");
  });

  it("should create mock silo with options", () => {
    const silo = createMockSiloWithOptions();

    expect(silo.has_options).toBe(true);
    expect(silo.options).toHaveProperty("45");
    expect(silo.options).toHaveProperty("55");
  });

  it("should create multiple mock silos", () => {
    const silos = createMockSilos(5);

    expect(silos).toHaveLength(5);
    expect(silos[0].id).toBe(1);
    expect(silos[4].id).toBe(5);
  });
});

describe("Test Helpers - Validadores", () => {
  it("should validate prices correctly", () => {
    expect(isValidPrice(1000)).toBe(true);
    expect(isValidPrice(0)).toBe(false);
    expect(isValidPrice(-100)).toBe(false);
    expect(isValidPrice(NaN)).toBe(false);
  });

  it("should validate formatted prices", () => {
    expect(isValidFormattedPrice("$1,000")).toBe(true);
    expect(isValidFormattedPrice("$0")).toBe(true);
    expect(isValidFormattedPrice("1000")).toBe(false);
  });

  it("should validate emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user@company.ar")).toBe(true);
    expect(isValidEmail("invalid.email")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
  });

  it("should validate phone numbers", () => {
    expect(isValidPhoneNumber("1122334455")).toBe(true);
    expect(isValidPhoneNumber("123456789")).toBe(true);
    expect(isValidPhoneNumber("12345")).toBe(false);
    expect(isValidPhoneNumber("123")).toBe(false);
  });

  it("should validate silo links", () => {
    expect(isValidSiloLink("/silos/comederos/silo1")).toBe(true);
    expect(isValidSiloLink("/silos/aereos/silo1")).toBe(true);
    expect(isValidSiloLink("silos/comederos/silo1")).toBe(false);
  });

  it("should validate silo types", () => {
    expect(isValidSiloType("comederos")).toBe(true);
    expect(isValidSiloType("aereos")).toBe(true);
    expect(isValidSiloType("otros")).toBe(false);
  });

  it("should validate image URLs", () => {
    expect(isValidImageUrl("/images/silo.jpg")).toBe(true);
    expect(isValidImageUrl("https://example.com/image.jpg")).toBe(true);
    expect(isValidImageUrl("images/silo.jpg")).toBe(false);
  });

  it("should validate descriptions", () => {
    expect(isValidDescription("Valid description")).toBe(true);
    expect(isValidDescription("")).toBe(false);
  });

  it("should check required silo props", () => {
    const validSilo = createMockSilo();
    expect(hasRequiredSiloProps(validSilo)).toBe(true);

    const incompleteSilo = { id: 1, name: "test" };
    expect(hasRequiredSiloProps(incompleteSilo)).toBe(false);
  });

  it("should check required preferences props", () => {
    const validPrefs = createMockPreferences();
    expect(hasRequiredPreferencesProps(validPrefs)).toBe(true);

    const incompletePrefs = { company_id: "test", dollar_quote: 850 };
    expect(hasRequiredPreferencesProps(incompletePrefs)).toBe(false);
  });
});

describe("Test Helpers - Cálculos", () => {
  it("should calculate cone price for 45°", () => {
    const prefs = createMockPreferences();
    const basePrice = 1000;
    const price45 = calculateConePrice(basePrice, "45", prefs);

    expect(price45).toBe(1100); // 1000 + 10%
  });

  it("should calculate cone price for 55°", () => {
    const prefs = createMockPreferences();
    const basePrice = 1000;
    const price55 = calculateConePrice(basePrice, "55", prefs);

    expect(price55).toBe(1150); // 1000 + 15%
  });

  it("should calculate price with markup", () => {
    const basePrice = 1000;
    const priceWithMarkup = calculatePriceWithMarkup(basePrice, 20);

    expect(priceWithMarkup).toBe(1200); // 1000 + 20%
  });

  it("should calculate price with IVA deduction", () => {
    const basePrice = 1000;
    const priceAfterIVA = calculatePriceWithIVA(basePrice, 21);

    expect(priceAfterIVA).toBeCloseTo(790); // 1000 - 21%
  });
});

describe("Test Helpers - Generadores de Datos", () => {
  it("should generate random price within range", () => {
    const price = generateRandomPrice(100, 1000);

    expect(price).toBeGreaterThanOrEqual(100);
    expect(price).toBeLessThanOrEqual(1000);
  });

  it("should generate test email", () => {
    const email = generateTestEmail(1);
    expect(isValidEmail(email)).toBe(true);
    expect(email).toContain("@remeco.com");
  });

  it("should generate test phone", () => {
    const phone = generateTestPhone();
    expect(isValidPhoneNumber(phone)).toBe(true);
  });

  it("should generate test message", () => {
    const message = generateTestMessage();
    expect(message.length).toBeGreaterThan(10);
  });
});

describe("Test Helpers - Comparadores", () => {
  it("should compare prices with tolerance", () => {
    expect(arePricesEqual(1000, 1000)).toBe(true);
    expect(arePricesEqual(1000, 1000.005, 0.01)).toBe(true);
    expect(arePricesEqual(1000, 1100)).toBe(false);
  });
});

describe("Test Helpers - Builders", () => {
  it("should build preferences with builder pattern", () => {
    const prefs = new PreferencesBuilder()
      .withDollarQuote(1000)
      .withMarkup(25)
      .withIVA(0)
      .build();

    expect(prefs.dollar_quote).toBe(1000);
    expect(prefs.default_markup).toBe(25);
    expect(prefs.iva_percentage).toBe(0);
  });

  it("should build silo with builder pattern", () => {
    const silo = new SiloBuilder()
      .withName("premium-silo")
      .withType("aereos")
      .withDescription("Premium silo with options")
      .withOptions({ "45": "info45", "55": "info55" })
      .build();

    expect(silo.name).toBe("premium-silo");
    expect(silo.silo_type).toBe("aereos");
    expect(silo.has_options).toBe(true);
  });

  it("should chain builder methods", () => {
    const silo = new SiloBuilder()
      .withName("test")
      .withType("comederos")
      .withImageUrl("https://example.com/image.jpg")
      .withDescription("Test description")
      .build();

    expect(isValidSiloType(silo.silo_type)).toBe(true);
    expect(isValidImageUrl(silo.image_url)).toBe(true);
    expect(isValidDescription(silo.description)).toBe(true);
  });
});

describe("Test Helpers - Integration Examples", () => {
  it("should use multiple helpers together", () => {
    const prefs = new PreferencesBuilder()
      .withDollarQuote(950)
      .withMarkup(15)
      .build();

    const silo = new SiloBuilder()
      .withName("integration-test")
      .withType("aereos")
      .withOptions({ "45": "base45", "55": "base55" })
      .build();

    expect(hasRequiredPreferencesProps(prefs)).toBe(true);
    expect(hasRequiredSiloProps(silo)).toBe(true);

    const price45 = calculateConePrice(1000, "45", prefs);
    expect(price45).toBeGreaterThan(1000);
  });

  it("should work with mock silos in list", () => {
    const silos = createMockSilos(3);
    const validLinks = silos.every((silo) =>
      isValidSiloLink(`/silos/${silo.silo_type}/${silo.name}`)
    );

    expect(validLinks).toBe(true);
  });
});
