import type { Preferences, Silo } from "../types/types";

/**
 * Utilidades y fixtures para testing de componentes
 * Estos helpers facilitan la creación de mocks y la validación de datos
 */

// ============================================
// FIXTURES - Datos de prueba reutilizables
// ============================================

export const createMockPreferences = (
  overrides?: Partial<Preferences>
): Preferences => ({
  company_id: "remeco-test",
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
  ...overrides,
});

export const createMockSilo = (overrides?: Partial<Silo>): Silo => ({
  id: 1,
  name: "test-silo",
  image_url: "/test-image.jpg",
  silo_type: "comederos",
  description: "Test silo description",
  has_options: false,
  options: {},
  ...overrides,
});

export const createMockSiloWithOptions = (overrides?: Partial<Silo>): Silo => ({
  ...createMockSilo(),
  has_options: true,
  options: {
    "45": "Cono base 45 grados",
    "55": "Cono base 55 grados",
  },
  ...overrides,
});

export const createMockSilos = (count: number = 3): Silo[] => {
  return Array.from({ length: count }, (_, i) => {
    const type = i % 2 === 0 ? "comederos" : "aereos";
    const hasOptions = i % 2 === 0;
    const options: Record<string, string> = hasOptions
      ? { "45": "info", "55": "info" }
      : {};

    return {
      id: i + 1,
      name: `silo-${i + 1}`,
      image_url: `/images/silo-${i + 1}.jpg`,
      silo_type: type,
      description: `Silo description ${i + 1}`,
      has_options: hasOptions,
      options,
    };
  });
};

// ============================================
// VALIDADORES - Helpers para assertions
// ============================================

export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && price > 0 && isFinite(price);
};

export const isValidFormattedPrice = (price: string): boolean => {
  return price.includes("$") && price.match(/\d+/) !== null;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Argentina: 7-15 dígitos
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phone);
};

export const isValidSiloLink = (link: string): boolean => {
  return link.startsWith("/silos/") && !link.endsWith("/");
};

export const isValidSiloType = (type: string): boolean => {
  return ["comederos", "aereos"].includes(type);
};

export const isValidImageUrl = (url: string): boolean => {
  return url.startsWith("/") || url.startsWith("http");
};

export const isValidDescription = (description: string): boolean => {
  return typeof description === "string" && description.length > 0;
};

export const hasRequiredSiloProps = (silo: Partial<Silo>): boolean => {
  const requiredProps = ["id", "name", "image_url", "silo_type", "description"];
  return requiredProps.every((prop) => prop in silo);
};

export const hasRequiredPreferencesProps = (
  prefs: Partial<Preferences>
): boolean => {
  const requiredProps = [
    "company_id",
    "dollar_quote",
    "default_markup",
    "iva_percentage",
    "feeder_silos",
    "airbase_silos",
  ];
  return requiredProps.every((prop) => prop in prefs);
};

// ============================================
// CÁLCULOS DE PRUEBA
// ============================================

export const calculateConePrice = (
  basePrice: number,
  coneAngle: "45" | "55",
  preferences: Preferences
): number => {
  const adjustment =
    coneAngle === "45" ? preferences.cone_base_45 : preferences.cone_base_55;
  return basePrice * (1 + adjustment / 100);
};

export const calculatePriceWithMarkup = (
  basePrice: number,
  markup: number
): number => {
  return basePrice * (1 + markup / 100);
};

export const calculatePriceWithIVA = (
  basePrice: number,
  ivaPercentage: number
): number => {
  return basePrice * (1 - ivaPercentage / 100);
};

// ============================================
// GENERADORES DE DATOS DE PRUEBA
// ============================================

export const generateRandomPrice = (
  min: number = 100,
  max: number = 10000
): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateTestEmail = (index: number = 1): string => {
  return `test${index}@remeco.com`;
};

export const generateTestPhone = (): string => {
  return "1122334455";
};

export const generateTestMessage = (length: number = 50): string => {
  const messages = [
    "Quisiera consultar sobre los silos disponibles.",
    "Necesito información sobre precios y características.",
    "Me gustaría recibir un presupuesto para silos aereos.",
    "Tengo duda sobre el proceso de compra.",
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message;
};

// ============================================
// COMPARADORES - Para validaciones complejas
// ============================================

export const arePricesEqual = (
  price1: number,
  price2: number,
  tolerance: number = 0.01
): boolean => {
  return Math.abs(price1 - price2) <= tolerance;
};

export const isPriceGreater = (price1: number, price2: number): boolean => {
  return price1 > price2;
};

export const isPriceLess = (price1: number, price2: number): boolean => {
  return price1 < price2;
};

export const areSiloTypesEqual = (type1: string, type2: string): boolean => {
  return type1.toLowerCase() === type2.toLowerCase();
};

// ============================================
// BUILDERS - Para construir objetos complejos
// ============================================

export class PreferencesBuilder {
  private prefs: Preferences = createMockPreferences();

  withDollarQuote(quote: number): PreferencesBuilder {
    this.prefs.dollar_quote = quote;
    return this;
  }

  withMarkup(markup: number): PreferencesBuilder {
    this.prefs.default_markup = markup;
    return this;
  }

  withIVA(iva: number): PreferencesBuilder {
    this.prefs.iva_percentage = iva;
    return this;
  }

  withConeBase45(value: number): PreferencesBuilder {
    this.prefs.cone_base_45 = value;
    return this;
  }

  withConeBase55(value: number): PreferencesBuilder {
    this.prefs.cone_base_55 = value;
    return this;
  }

  build(): Preferences {
    return this.prefs;
  }
}

export class SiloBuilder {
  private silo: Silo = createMockSilo();

  withName(name: string): SiloBuilder {
    this.silo.name = name;
    return this;
  }

  withType(type: "comederos" | "aereos"): SiloBuilder {
    this.silo.silo_type = type;
    return this;
  }

  withDescription(description: string): SiloBuilder {
    this.silo.description = description;
    return this;
  }

  withOptions(options: Record<string, string>): SiloBuilder {
    this.silo.has_options = true;
    this.silo.options = options;
    return this;
  }

  withImageUrl(url: string): SiloBuilder {
    this.silo.image_url = url;
    return this;
  }

  build(): Silo {
    return this.silo;
  }
}

// ============================================
// LIMPIEZA Y SETUP
// ============================================

export const resetTestData = (): void => {
  // Aquí puedes agregar lógica para limpiar datos de prueba si es necesario
};

export const setupTestEnvironment = (): void => {
  // Configuración inicial para todos los tests
};

export const teardownTestEnvironment = (): void => {
  // Limpieza después de todos los tests
  resetTestData();
};
