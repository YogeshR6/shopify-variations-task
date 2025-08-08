"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, IndianRupee } from "lucide-react";
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
  // Filter variations that have options
  const variationsWithOptions = useMemo(() => {
    return variations.filter((variation) => variation.options.length > 0);
  }, [variations]);

  // Set default groupBy to first variation if not set
  const [groupBy, setGroupBy] = useState<string | null>(
    pricingData.groupBy || variationsWithOptions[0]?.id || null
  );
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(
    pricingData.openGroups || {}
  );

  // Update groupBy when variations change and no groupBy is set
  useEffect(() => {
    if (!groupBy && variationsWithOptions.length > 0) {
      const defaultGroupBy = variationsWithOptions[0].id;
      setGroupBy(defaultGroupBy);
      handleGroupByChange(defaultGroupBy);
    }
  }, [variationsWithOptions, groupBy]);

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
      // Default to first variation if no groupBy is set
      const defaultGroupBy = variationsWithOptions[0]?.id;
      if (defaultGroupBy) {
        const groups: { [key: string]: Array<{ [key: string]: string }> } = {};

        allCombinations.forEach((combo) => {
          const groupValue = combo[defaultGroupBy] || "Ungrouped";
          if (!groups[groupValue]) {
            groups[groupValue] = [];
          }
          groups[groupValue].push(combo);
        });

        return groups;
      }
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
  }, [allCombinations, groupBy, variationsWithOptions]);

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

  // Get price range for a group
  const getGroupPriceRange = (
    combinations: Array<{ [key: string]: string }>
  ) => {
    const prices = combinations
      .map((combo) => getPriceForCombination(combo))
      .filter((price) => price && parseFloat(price) > 0)
      .map((price) => parseFloat(price));

    if (prices.length === 0) return null;
    if (prices.length === 1) return `₹${prices[0].toFixed(2)}`;

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `₹${min.toFixed(2)}`
      : `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
  };

  // Apply group price to all combinations in group
  const applyGroupPrice = (
    groupName: string,
    combinations: Array<{ [key: string]: string }>,
    price: string
  ) => {
    if (!price.trim()) return;

    const updatedCombinations = [...pricingData.combinations];

    combinations.forEach((combination) => {
      // Remove existing price for this combination
      const existingIndex = updatedCombinations.findIndex(
        (pc) => JSON.stringify(pc.combination) === JSON.stringify(combination)
      );

      if (existingIndex >= 0) {
        updatedCombinations.splice(existingIndex, 1);
      }

      // Add new price
      updatedCombinations.push({
        id: `combo-${Object.values(combination).join("-")}-${Date.now()}`,
        combination,
        price: price.trim(),
      });
    });

    // Update group price
    const updatedGroupPrices = {
      ...pricingData.groupPrices,
      [groupName]: price.trim(),
    };

    onPricingUpdate({
      ...pricingData,
      combinations: updatedCombinations,
      groupPrices: updatedGroupPrices,
    });
  };

  // Toggle group accordion
  const toggleGroup = (groupName: string) => {
    const updatedOpenGroups = {
      ...openGroups,
      [groupName]: !openGroups[groupName],
    };

    setOpenGroups(updatedOpenGroups);

    onPricingUpdate({
      ...pricingData,
      openGroups: updatedOpenGroups,
    });
  };

  // Handle group by change
  const handleGroupByChange = (newGroupBy: string | null) => {
    setGroupBy(newGroupBy);
    setOpenGroups({}); // Reset open groups when changing groupBy
    onPricingUpdate({
      ...pricingData,
      groupBy: newGroupBy,
      openGroups: {},
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
          <IndianRupee size={48} className="mx-auto text-gray-400 mb-4" />
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
              value={groupBy || variationsWithOptions[0]?.id || ""}
              onChange={(e) => handleGroupByChange(e.target.value || null)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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
      <div className="space-y-4">
        {Object.entries(groupedCombinations).map(
          ([groupName, combinations]) => {
            const isGrouped = Object.keys(groupedCombinations).length > 1;
            const isGroupOpen = openGroups[groupName] !== false; // default to open
            const groupPriceRange = getGroupPriceRange(combinations);
            const groupPrice = pricingData.groupPrices?.[groupName] || "";

            return (
              <div
                key={groupName}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {isGrouped && (
                  <div className="bg-gray-50 border-b border-gray-200">
                    {/* Group Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleGroup(groupName)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-gray-800">
                          {isGroupOpen ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {groupName}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {combinations.length} combination
                            {combinations.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {/* Group Price Input */}
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-sm text-gray-600">
                          Group Price:
                        </span>
                        <IndianRupee size={16} className="text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={groupPriceRange || "Set all"}
                          value={groupPrice}
                          onChange={(e) => {
                            const updatedGroupPrices = {
                              ...pricingData.groupPrices,
                              [groupName]: e.target.value,
                            };
                            onPricingUpdate({
                              ...pricingData,
                              groupPrices: updatedGroupPrices,
                            });
                          }}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              applyGroupPrice(
                                groupName,
                                combinations,
                                e.target.value
                              );
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              applyGroupPrice(
                                groupName,
                                combinations,
                                e.currentTarget.value
                              );
                            }
                          }}
                          className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Content */}
                {(!isGrouped || isGroupOpen) && (
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
                          <IndianRupee size={16} className="text-gray-400" />
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
                )}
              </div>
            );
          }
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
