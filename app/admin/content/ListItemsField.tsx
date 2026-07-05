"use client";

import { useEffect, useState } from "react";

type ListItemsFieldProps = {
  resetKey: string | boolean;
  name: string;
  label: string;
  initialItems?: string[];
  placeholder?: string;
  inputClassName: string;
};

export default function ListItemsField({
  resetKey,
  name,
  label,
  initialItems,
  placeholder = "Item",
  inputClassName,
}: ListItemsFieldProps) {
  const [items, setItems] = useState<string[]>([""]);

  useEffect(() => {
    setItems(initialItems?.length ? initialItems : [""]);
  }, [resetKey, initialItems]);

  function addItem() {
    setItems((current) => [...current, ""]);
  }

  function removeItem(index: number) {
    setItems((current) => {
      if (current.length === 1) {
        return [""];
      }

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function updateItem(index: number, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              name={name}
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="shrink-0 rounded-lg border border-border p-2.5 text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${placeholder.toLowerCase()} ${index + 1}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
