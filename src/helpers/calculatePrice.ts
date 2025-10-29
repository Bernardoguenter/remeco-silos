import type { Preferences, Silo } from "../types/types";

export function getSiloPrice(
  name: string,
  preferences: Preferences,
  silo: Silo
) {
  if (!preferences) return 0;

  if (silo?.silo_type === "comederos") {
    const priceInArs =
      preferences.feeder_silos[name] * preferences.dollar_quote;

    const finalPrice = getFinalPrice(
      priceInArs,
      preferences.iva_percentage,
      preferences.default_markup
    );
    return finalPrice;
  }

  if (silo?.silo_type === "aereos") {
    const priceInArs =
      preferences.airbase_silos[name] * preferences.dollar_quote;

    const finalPrice = getFinalPrice(
      priceInArs,
      preferences.iva_percentage,
      preferences.default_markup
    );
    return finalPrice;
  }

  return 0;
}

const getFinalPrice = (
  price: number,
  iva_percentage: number,
  default_markup: number
) => {
  const priceBeforeTaxes = (price * (100 - iva_percentage)) / 100;

  const finalPrice =
    default_markup > 0
      ? priceBeforeTaxes * (1 + default_markup / 100)
      : priceBeforeTaxes;

  return finalPrice;
};
