"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { db } from "@/lib/db"

interface BranchStepProps {
  value: string | null
  onChange: (value: string) => void
}

interface Branch {
  id: string
  name: string
  location: string
  description: string
}

export default function BranchStep({ value, onChange }: BranchStepProps) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const data = await db.getBranches()
        setBranches(data)
      } catch (err) {
        console.error('Error fetching branches:', err)
        setError('Failed to load branches. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2 text-amber-800">Loading branches...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
        >
          Retry
        </Button>
      </div>
    )
  }

  // Fallback to hardcoded branches if no data is returned
  if (branches.length === 0) {
    const fallbackBranches = [
      { id: "bishoftu", name: "Bishoftu" },
      { id: "bahir-dar", name: "Bahir Dar" },
      { id: "entoto", name: "Entoto" },
      { id: "adama", name: "Adama" },
      { id: "awash", name: "Awash" },
      { id: "debre-zeit", name: "Debre Zeit" },
    ]
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-center">Which Kuriftu branch?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fallbackBranches.map((branch) => (
            <Button
              key={branch.id}
              variant={value === branch.id ? "default" : "outline"}
              className={`h-20 text-lg ${
                value === branch.id
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "border-amber-600 text-amber-700 hover:bg-amber-50"
              }`}
              onClick={() => onChange(branch.id)}
            >
              <MapPin className="mr-2 h-5 w-5" />
              {branch.name}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">
          Each branch has its own unique set of activities and experiences.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center">Which Kuriftu branch?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <Button
            key={branch.id}
            variant={value === branch.id ? "default" : "outline"}
            className={`h-20 text-lg ${
              value === branch.id
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "border-amber-600 text-amber-700 hover:bg-amber-50"
            }`}
            onClick={() => onChange(branch.id)}
          >
            <MapPin className="mr-2 h-5 w-5" />
            {branch.name}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Each branch has its own unique set of activities and experiences.
      </p>
    </div>
  )
}
