"use client"

import { Button } from "@/components/ui/button"
import { Clock, Sun, Moon, Calendar } from "lucide-react"

interface DurationStepProps {
  value: string | null
  onChange: (value: string) => void
}

const durations = [
  { id: "short", name: "Less than 2 hours", icon: Clock, emoji: "⏰" },
  { id: "half-day", name: "Half day", icon: Sun, emoji: "☀️" },
  { id: "full-day", name: "Full day", icon: Moon, emoji: "🌕" },
  { id: "multi-day", name: "Multiple days", icon: Calendar, emoji: "🗓️" },
]

export default function DurationStep({ value, onChange }: DurationStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center">How long do you plan to stay?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {durations.map((duration) => {
          const Icon = duration.icon

          return (
            <Button
              key={duration.id}
              variant={value === duration.id ? "default" : "outline"}
              className={`h-20 text-lg ${
                value === duration.id
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "border-amber-600 text-amber-700 hover:bg-amber-50"
              }`}
              onClick={() => onChange(duration.id)}
            >
              <span className="text-2xl mr-2">{duration.emoji}</span> {duration.name}
            </Button>
          )
        })}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        We'll plan activities that fit perfectly within your timeframe.
      </p>
    </div>
  )
}
