"use client";

import React from "react";

/**
 * What the agent should do if an item is out of stock or below standard at
 * the market. The FAQ promises customers can choose this; it reaches the
 * admin/agent as the first line of the order note.
 */
export type UnavailableChoice = "call" | "replace" | "remove";

export const UNAVAILABLE_OPTIONS: {
  value: UnavailableChoice;
  label: string;
  hint: string;
  /** Text written into the order note for the agent. */
  noteText: string;
}[] = [
  {
    value: "call",
    label: "Call me first",
    hint: "The agent calls you to decide",
    noteText: "Call the customer first",
  },
  {
    value: "replace",
    label: "Replace with something similar",
    hint: "Closest match in quality and price",
    noteText: "Replace with something similar",
  },
  {
    value: "remove",
    label: "Remove it",
    hint: "You won't be charged for it",
    noteText: "Remove it from the order",
  },
];

/** First line of the order note, e.g. "If an item is unavailable: Remove it from the order". */
export function unavailableNoteLine(choice: UnavailableChoice): string {
  const option = UNAVAILABLE_OPTIONS.find((o) => o.value === choice);
  return `If an item is unavailable: ${option?.noteText ?? "Call the customer first"}`;
}

interface Props {
  value: UnavailableChoice;
  onChange: (value: UnavailableChoice) => void;
}

const UnavailablePreference = ({ value, onChange }: Props) => (
  <fieldset className="flex flex-col gap-2 items-start w-full">
    <legend className="font-medium mb-2">If an item is unavailable</legend>
    <div className="flex flex-col md:flex-row gap-2 w-full">
      {UNAVAILABLE_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={`flex flex-1 items-start gap-3 border rounded-xl p-3 cursor-pointer ${
              selected ? "border-primary bg-primary/5" : "border-[#E7E7E7]"
            }`}
          >
            <input
              type="radio"
              name="unavailable-preference"
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="mt-1 accent-primary"
            />
            <span className="flex flex-col">
              <span className="body-medium font-medium">{option.label}</span>
              <span className="text-grey-300 body-small">{option.hint}</span>
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

export default UnavailablePreference;
