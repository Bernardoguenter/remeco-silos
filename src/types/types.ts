export interface Silo {
  id: number;
  name: string;
  image_url: string;
  silo_type: string;
  description: string;
}

export interface Preferences {
  company_id: string;
  dollar_quote: number;
  default_markup: number;
  iva_percentage: number;
  feeder_silos: FeederSilosPriceMap;
  airbase_silos: AirbaseSilosPriceMap;
  cone_base_45: number;
  cone_base_55: number;
}

export type AirbaseSilosPriceMap = Record<string, number>;
export type FeederSilosPriceMap = Record<string, number>;
