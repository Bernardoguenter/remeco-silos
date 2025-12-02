import { getGlobalPreferences } from "@lib/globalStore";
import type { Preferences, Silo } from "../types/types";
import { getSiloByName } from "@lib/silos";
import { getSiloPrice } from "./calculatePrice";

export const formatPrices = (price: number) => {
  if (isNaN(price)) return "$0";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

export const getSiloData = async (name: string) => {
  let silo: Silo | null = null;
  let preferences: Preferences | null = null;
  try {
    if (name) {
      [preferences, silo] = await Promise.all([
        getGlobalPreferences(),
        getSiloByName(name),
      ]);
    }
  } catch (err) {
    console.error("Error al obtener silos o preferencias:", err);
  }

  let price: number | null = null;

  if (preferences && silo) {
    price = name ? getSiloPrice(name, preferences, silo) : 0;
  }

  return { price, silo, preferences };
};
