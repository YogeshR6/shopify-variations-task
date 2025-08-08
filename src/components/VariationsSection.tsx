"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { Plus } from "lucide-react";
import { Variation, PricingData } from "@/types/variations";
import SortableVariation from "./SortableVariation";
import PricingSection from "./PricingSection";

const LOCAL_STORAGE_KEY = "shopify-variations";
const PRICING_STORAGE_KEY = "shopify-pricing";

export default function VariationsSection() {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [pricingData, setPricingData] = useState<PricingData>({
    combinations: [],
    groupBy: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedVariations = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedPricing = localStorage.getItem(PRICING_STORAGE_KEY);

    if (savedVariations) {
      try {
        const parsedVariations = JSON.parse(savedVariations);
        setVariations(parsedVariations);
      } catch (error) {
        console.error("Error loading variations from localStorage:", error);
      }
    }

    if (savedPricing) {
      try {
        const parsedPricing = JSON.parse(savedPricing);
        setPricingData(parsedPricing);
      } catch (error) {
        console.error("Error loading pricing from localStorage:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever variations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(variations));
    }
  }, [variations, isLoaded]);

  // Save to localStorage whenever pricing data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(pricingData));
    }
  }, [pricingData, isLoaded]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addVariation = () => {
    const newVariation: Variation = {
      id: `variation-${Date.now()}`,
      name: `Option ${variations.length + 1}`,
      options: [],
      isOpen: true,
      isEditingName: true,
    };
    setVariations([...variations, newVariation]);
  };

  const deleteVariation = (id: string) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  const updateVariation = (
    id: string,
    updatedVariation: Partial<Variation>
  ) => {
    setVariations(
      variations.map((variation) =>
        variation.id === id ? { ...variation, ...updatedVariation } : variation
      )
    );
  };

  const toggleVariation = (id: string) => {
    setVariations(
      variations.map((variation) =>
        variation.id === id
          ? { ...variation, isOpen: !variation.isOpen }
          : variation
      )
    );
  };

  const closeVariation = (id: string) => {
    setVariations(
      variations.map((variation) =>
        variation.id === id ? { ...variation, isOpen: false } : variation
      )
    );
  };

  const handlePricingUpdate = (newPricingData: PricingData) => {
    setPricingData(newPricingData);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setVariations((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    closeVariation(String(active.id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Variations</h1>
        <button
          onClick={addVariation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Variation
        </button>
      </div>

      {variations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-500 text-lg mb-2">
            No variations added yet
          </div>
          <div className="text-gray-400">
            Click "Add Variation" to get started
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={variations}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {variations.map((variation) => (
                <SortableVariation
                  key={variation.id}
                  variation={variation}
                  onDelete={deleteVariation}
                  onUpdate={updateVariation}
                  onToggle={toggleVariation}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Pricing Section */}
      <PricingSection
        variations={variations}
        pricingData={pricingData}
        onPricingUpdate={handlePricingUpdate}
      />
    </div>
  );
}
