"use client"

import { Button } from "@/components/ui/button"

interface LocationStepProps {
  value: boolean | null
  onChange: (value: boolean) => void
}

export default function LocationStep({ value, onChange }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center">Are you currently at Kuriftu?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={value === true ? "default" : "outline"}
          className={`h-24 text-lg ${
            value === true
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "border-green-600 text-green-700 hover:bg-green-50"
          }`}
          onClick={() => onChange(true)}
        >
          <span className="text-2xl mr-2">🟢</span> Yes, I'm here now
        </Button>
        <Button
          variant={value === false ? "default" : "outline"}
          className={`h-24 text-lg ${
            value === false
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-600 text-blue-700 hover:bg-blue-50"
          }`}
          onClick={() => onChange(false)}
        >
          <span className="text-2xl mr-2">🔵</span> No, I'm planning to visit soon
        </Button>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        This helps us filter activities by availability today or in the future.
      </p>
    </div>
  )
}
