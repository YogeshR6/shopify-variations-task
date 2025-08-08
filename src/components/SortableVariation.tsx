"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  GripVertical,
  X,
  Edit2,
} from "lucide-react";
import { Variation, VariationOption } from "@/types/variations";

interface SortableVariationProps {
  variation: Variation;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedVariation: Partial<Variation>) => void;
  onToggle: (id: string) => void;
}

export default function SortableVariation({
  variation,
  onDelete,
  onUpdate,
  onToggle,
}: SortableVariationProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(variation.name);
  const [newOptionName, setNewOptionName] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNameSave = () => {
    onUpdate(variation.id, { name: editedName });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(variation.name);
    setIsEditingName(false);
  };

  const addOption = () => {
    if (newOptionName.trim()) {
      const newOption: VariationOption = {
        id: `option-${Date.now()}`,
        name: newOptionName.trim(),
      };
      onUpdate(variation.id, {
        options: [...variation.options, newOption],
      });
      setNewOptionName("");
    }
  };

  const deleteOption = (optionId: string) => {
    onUpdate(variation.id, {
      options: variation.options.filter((option) => option.id !== optionId),
    });
  };

  const updateOption = (optionId: string, field: "name", value: string) => {
    onUpdate(variation.id, {
      options: variation.options.map((option) =>
        option.id === optionId ? { ...option, [field]: value } : option
      ),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Variation Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>

        <button
          onClick={() => onToggle(variation.id)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          {variation.isOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSave();
                  if (e.key === "Escape") handleNameCancel();
                }}
                autoFocus
              />
              <button
                onClick={handleNameSave}
                className="text-green-600 hover:text-green-700"
              >
                ✓
              </button>
              <button
                onClick={handleNameCancel}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{variation.name}</h3>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {variation.options.length} option
          {variation.options.length !== 1 ? "s" : ""}
        </div>

        <button
          onClick={() => onDelete(variation.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Variation Content */}
      {variation.isOpen && (
        <div className="p-4 space-y-4">
          {/* Existing Options */}
          {variation.options.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Options</h4>
              {variation.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Option Name
                      </label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) =>
                          updateOption(option.id, "name", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="e.g., Color"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteOption(option.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Option */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Add New Option
            </h4>
            <div className="flex items-end gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Option Name
                  </label>
                  <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="e.g., Color, Size"
                  />
                </div>
              </div>
              <button
                onClick={addOption}
                disabled={!newOptionName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
