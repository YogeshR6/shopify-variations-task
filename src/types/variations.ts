export interface VariationOption {
  id: string;
  name: string;
}

export interface Variation {
  id: string;
  name: string;
  options: VariationOption[];
  isOpen: boolean;
}
