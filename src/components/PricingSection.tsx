"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, DollarSign } from "lucide-react";
import { Variation, PriceCombination, PricingData } from "@/types/variations";

interface PricingSectionProps {
  variations: Variation[];
  pricingData: PricingData;
  onPricingUpdate: (pricingData: PricingData) => void;
}

export default function PricingSection({
  variations,
  pricingData,
  onPricingUpdate,
}: PricingSectionProps) {
  const [groupBy, setGroupBy] = useState<string | null>(pricingData.groupBy);

  // Filter variations that have options
  const variationsWithOptions = useMemo(() => {
    return variations.filter((variation) => variation.options.length > 0);
  }, [variations]);

  // Generate all possible combinations
  const allCombinations = useMemo(() => {
    if (variationsWithOptions.length === 0) return [];

    const generateCombinations = (
      variations: Variation[]
    ): Array<{ [key: string]: string }> => {
      if (variations.length === 0) return [{}];

      const [first, ...rest] = variations;
      const restCombinations = generateCombinations(rest);
      const combinations: Array<{ [key: string]: string }> = [];

      first.options.forEach((option) => {
        restCombinations.forEach((restCombo) => {
          combinations.push({
            [first.id]: option.name,
            ...restCombo,
          });
        });
      });

      return combinations;
    };

    return generateCombinations(variationsWithOptions);
  }, [variationsWithOptions]);

  // Group combinations based on selected groupBy variation
  const groupedCombinations = useMemo(() => {
    if (!groupBy || allCombinations.length === 0) {
      return { "All Combinations": allCombinations };
    }

    const groups: { [key: string]: Array<{ [key: string]: string }> } = {};

    allCombinations.forEach((combo) => {
      const groupValue = combo[groupBy] || "Ungrouped";
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(combo);
    });

    return groups;
  }, [allCombinations, groupBy]);

  // Get price for a specific combination
  const getPriceForCombination = (combination: {
    [key: string]: string;
  }): string => {
    const existing = pricingData.combinations.find(
      (pc) => JSON.stringify(pc.combination) === JSON.stringify(combination)
    );
    return existing?.price || "";
  };

  // Update price for a specific combination
  const updatePrice = (
    combination: { [key: string]: string },
    price: string
  ) => {
    const combinationId = `combo-${Object.values(combination).join(
      "-"
    )}-${Date.now()}`;

    const updatedCombinations = pricingData.combinations.filter(
      (pc) => JSON.stringify(pc.combination) !== JSON.stringify(combination)
    );

    if (price.trim()) {
      updatedCombinations.push({
        id: combinationId,
        combination,
        price: price.trim(),
      });
    }

    onPricingUpdate({
      ...pricingData,
      combinations: updatedCombinations,
    });
  };

  // Handle group by change
  const handleGroupByChange = (newGroupBy: string | null) => {
    setGroupBy(newGroupBy);
    onPricingUpdate({
      ...pricingData,
      groupBy: newGroupBy,
    });
  };

  // Format combination display
  const formatCombination = (combination: { [key: string]: string }) => {
    return variationsWithOptions
      .map((variation) => {
        const optionName = variation.name;
        const optionValue = combination[variation.id];
        return `${optionName}: ${optionValue}`;
      })
      .join(" • ");
  };

  if (variationsWithOptions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Price Combinations
          </h2>
          <p className="text-gray-500">
            Add variations with options to set up pricing combinations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Price Combinations
        </h2>

        {/* Group By Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group combinations by:
          </label>
          <div className="relative inline-block">
            <select
              value={groupBy || ""}
              onChange={(e) => handleGroupByChange(e.target.value || null)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No grouping</option>
              {variationsWithOptions.map((variation) => (
                <option key={variation.id} value={variation.id}>
                  {variation.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="space-y-6">
        {Object.entries(groupedCombinations).map(
          ([groupName, combinations]) => (
            <div
              key={groupName}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {Object.keys(groupedCombinations).length > 1 && (
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">{groupName}</h3>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {combinations.map((combination, index) => (
                  <div
                    key={index}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {formatCombination(combination)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.entries(combination)
                          .map(([varId, value]) => {
                            const variation = variationsWithOptions.find(
                              (v) => v.id === varId
                            );
                            return variation
                              ? `${variation.name}: ${value}`
                              : null;
                          })
                          .filter(Boolean)
                          .join(" • ")}
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={getPriceForCombination(combination)}
                        onChange={(e) =>
                          updatePrice(combination, e.target.value)
                        }
                        className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {allCombinations.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          {allCombinations.length} combination
          {allCombinations.length !== 1 ? "s" : ""} total
        </div>
      )}
    </div>
  );
}
