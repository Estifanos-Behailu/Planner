"use client"

import { Button } from "@/components/ui/button"
import { SpadeIcon as Spa, Palette, UtensilsCrossed, Waves, Mountain, ShoppingBag } from "lucide-react"

interface InterestStepProps {
  values: string[]
  onChange: (values: string[]) => void
}

const interests = [
  { id: "relaxation", name: "Relaxation", icon: Spa, emoji: "🧘" },
  { id: "culture", name: "Culture & Art", icon: Palette, emoji: "🎨" },
  { id: "food", name: "Food & Drinks", icon: UtensilsCrossed, emoji: "🍽️" },
  { id: "water", name: "Water Fun", icon: Waves, emoji: "🛶" },
  { id: "adventure", name: "Adventure", icon: Mountain, emoji: "🧗" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, emoji: "🛍️" },
]

export default function InterestStep({ values, onChange }: InterestStepProps) {
  const toggleInterest = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id))
    } else {
      onChange([...values, id])
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center">What type of experience are you looking for?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {interests.map((interest) => {
          const Icon = interest.icon
          const isSelected = values.includes(interest.id)

          return (
            <Button
              key={interest.id}
              variant={isSelected ? "default" : "outline"}
              className={`h-20 text-lg ${
                isSelected
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "border-amber-600 text-amber-700 hover:bg-amber-50"
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <span className="flex flex-col items-center">
                <span className="text-xl mb-1">{interest.emoji}</span>
                <span>{interest.name}</span>
              </span>
            </Button>
          )
        })}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Select one or more interests to help us recommend the best activities.
      </p>
    </div>
  )
}
