"use client"

import { Button } from "@/components/ui/button"

interface GroupTypeStepProps {
  value: string | null
  onChange: (value: string) => void
}

const groupTypes = [
  { id: "solo", name: "Solo", emoji: "👤" },
  { id: "couple", name: "Couple", emoji: "👩‍❤️‍👨" },
  { id: "family", name: "Family", emoji: "👨‍👩‍👧" },
  { id: "friends", name: "Friends", emoji: "🧑‍🤝‍🧑" },
]

export default function GroupTypeStep({ value, onChange }: GroupTypeStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center">Who are you traveling with?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groupTypes.map((type) => (
          <Button
            key={type.id}
            variant={value === type.id ? "default" : "outline"}
            className={`h-20 text-lg ${
              value === type.id
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "border-amber-600 text-amber-700 hover:bg-amber-50"
            }`}
            onClick={() => onChange(type.id)}
          >
            <span className="text-2xl mr-2">{type.emoji}</span> {type.name}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">We'll tailor activities that are perfect for your group.</p>
    </div>
  )
}
