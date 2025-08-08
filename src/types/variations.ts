export interface VariationOption {
  id: string;
  name: string;
}

export interface Variation {
  id: string;
  name: string;
  options: VariationOption[];
  isOpen: boolean;
  isEditingName?: boolean;
}

export interface PriceCombination {
  id: string;
  combination: { [variationId: string]: string }; // variationId -> option value
  price: string;
}

export interface PricingData {
  combinations: PriceCombination[];
  groupBy: string | null; // variationId to group by
  groupPrices: { [groupName: string]: string }; // group name -> price
  openGroups: { [groupName: string]: boolean }; // track which groups are open
}
