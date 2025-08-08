"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { VariationOption } from "@/types/variations";

interface SortableOptionProps {
  option: VariationOption;
  onDelete: (optionId: string) => void;
  onUpdate: (optionId: string, field: "name", value: string) => void;
}

export default function SortableOption({
  option,
  onDelete,
  onUpdate,
}: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">Option Value</label>
        <input
          type="text"
          value={option.name}
          onChange={(e) => onUpdate(option.id, "name", e.target.value)}
          className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded"
          style={{ color: "#111827" }}
          placeholder="e.g., Red, Large, Cotton"
        />
      </div>

      <button
        onClick={() => onDelete(option.id)}
        className="text-red-500 hover:text-red-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}
