"use client";

import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  GripVertical,
  Edit2,
  X,
} from "lucide-react";
import { Variation, VariationOption } from "@/types/variations";
import SortableOption from "./SortableOption";

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
  const [isEditingName, setIsEditingName] = useState(
    variation.isEditingName || false
  );
  const [editedName, setEditedName] = useState(variation.name);
  const [newOptionName, setNewOptionName] = useState("");
  const [autoFocusNewOption, setAutoFocusNewOption] = useState(false);
  const [showAddOptionForm, setShowAddOptionForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-focus when component mounts and isEditingName is true
  useEffect(() => {
    if (variation.isEditingName) {
      setIsEditingName(true);
    }
  }, [variation.isEditingName]);

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
    onUpdate(variation.id, { name: editedName, isEditingName: false });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(variation.name);
    onUpdate(variation.id, { isEditingName: false });
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
      setShowAddOptionForm(false);
      setAutoFocusNewOption(false);
    }
  };

  const cancelAddOption = () => {
    setNewOptionName("");
    setShowAddOptionForm(false);
    setAutoFocusNewOption(false);
  };

  const startAddingOption = () => {
    setShowAddOptionForm(true);
    setAutoFocusNewOption(true);
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

  const handleOptionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = variation.options.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = variation.options.findIndex(
        (item) => item.id === over?.id
      );

      const reorderedOptions = arrayMove(variation.options, oldIndex, newIndex);
      onUpdate(variation.id, { options: reorderedOptions });
    }
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
                placeholder="Option Name (e.g., Color, Size)"
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

        {variation.isOpen && (
          <button
            onClick={() => onDelete(variation.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Variation Content */}
      {variation.isOpen && (
        <div className="p-4 space-y-4">
          {/* Existing Options */}
          {variation.options.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Options</h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleOptionsDragEnd}
              >
                <SortableContext
                  items={variation.options}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {variation.options.map((option) => (
                      <SortableOption
                        key={option.id}
                        option={option}
                        onDelete={deleteOption}
                        onUpdate={updateOption}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Add New Option */}
          <div className="border-t border-gray-100 pt-4">
            {!showAddOptionForm ? (
              <button
                onClick={startAddingOption}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Option
              </button>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Add New Option
                </h4>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Option Value
                    </label>
                    <input
                      type="text"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="e.g., Red, Large, Cotton"
                      autoFocus={autoFocusNewOption}
                      onFocus={() => setAutoFocusNewOption(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addOption();
                        if (e.key === "Escape") cancelAddOption();
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addOption}
                      disabled={!newOptionName.trim()}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Done
                    </button>
                    <button
                      onClick={cancelAddOption}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
