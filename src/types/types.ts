export interface Silo {
  id: number;
  name: string;
  image_url: string;
  image_url_sm: string;
  silo_type: string;
  description: string;
  has_options: boolean;
  options: Record<string, string>;
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
  fiber_base_cost: number;
  has_fiber_base: string[];
}

export type AirbaseSilosPriceMap = Record<string, number>;
export type FeederSilosPriceMap = Record<string, number>;
