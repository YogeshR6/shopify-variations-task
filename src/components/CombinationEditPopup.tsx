"use client";

import React, { useState, useEffect } from "react";
import { X, IndianRupee, TrendingUp, Percent } from "lucide-react";
import { PriceCombination, Variation } from "@/types/variations";

interface CombinationEditPopupProps {
  combination: { [key: string]: string };
  priceCombination?: PriceCombination;
  variations: Variation[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    combination: { [key: string]: string },
    updates: Partial<PriceCombination>
  ) => void;
}

export default function CombinationEditPopup({
  combination,
  priceCombination,
  variations,
  isOpen,
  onClose,
  onUpdate,
}: CombinationEditPopupProps) {
  const [price, setPrice] = useState(priceCombination?.price || "");
  const [costPerItem, setCostPerItem] = useState(
    priceCombination?.costPerItem || ""
  );

  // Update local state when props change
  useEffect(() => {
    setPrice(priceCombination?.price || "");
    setCostPerItem(priceCombination?.costPerItem || "");
  }, [priceCombination]);

  // Calculate profit and margin
  const priceNum = parseFloat(price) || 0;
  const costNum = parseFloat(costPerItem) || 0;
  const profit = priceNum - costNum;
  const margin = priceNum > 0 ? (profit / priceNum) * 100 : 0;

  const handleSave = () => {
    onUpdate(combination, {
      price: price.trim(),
      costPerItem: costPerItem.trim(),
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCombination = (combination: { [key: string]: string }) => {
    return Object.values(combination).join(" × ");
  };

  const getCombinationDetails = (combination: { [key: string]: string }) => {
    return Object.entries(combination)
      .map(([varId, value]) => {
        const variation = variations.find((v) => v.id === varId);
        return variation ? `${variation.name}: ${value}` : null;
      })
      .filter(Boolean)
      .join(" • ");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Combination
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {formatCombination(combination)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getCombinationDetails(combination)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <div className="flex items-center">
              <IndianRupee size={16} className="text-gray-400 mr-2" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: "#111827" }}
              />
            </div>
          </div>

          {/* Cost per Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost per Item
            </label>
            <div className="flex items-center">
              <IndianRupee size={16} className="text-gray-400 mr-2" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={costPerItem}
                onChange={(e) => setCostPerItem(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: "#111827" }}
              />
            </div>
          </div>

          {/* Calculated Fields */}
          <div className="border-t pt-4 space-y-3">
            {/* Profit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Profit
                </span>
              </div>
              <div className="flex items-center text-sm font-medium">
                <IndianRupee size={14} className="text-gray-400" />
                <span
                  className={profit >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {profit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Margin */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Margin
                </span>
              </div>
              <div className="text-sm font-medium">
                <span
                  className={margin >= 0 ? "text-blue-600" : "text-red-600"}
                >
                  {margin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
