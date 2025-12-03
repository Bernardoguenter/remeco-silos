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

    const finalPrice = getFinalPrice(priceInArs, preferences.default_markup);
    return finalPrice;
  }

  if (silo?.silo_type === "aereos") {
    const priceInArs =
      preferences.airbase_silos[name] * preferences.dollar_quote;

    const finalPrice = getFinalPrice(priceInArs, preferences.default_markup);
    return finalPrice;
  }

  return 0;
}

const getFinalPrice = (price: number, default_markup: number) => {
  const finalPrice =
    default_markup > 0 ? price * (1 + default_markup / 100) : price;

  return finalPrice;
};
