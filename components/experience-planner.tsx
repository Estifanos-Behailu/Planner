"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import LocationStep from "./steps/location-step"
import BranchStep from "./steps/branch-step"
import InterestStep from "./steps/interest-step"
import GroupTypeStep from "./steps/group-type-step"
import DurationStep from "./steps/duration-step"
import ChatInterface from "./chat-interface"

export type UserPreferences = {
  isCurrentlyAtKuriftu: boolean | null
  selectedBranch: string | null
  interests: string[]
  groupType: string | null
  duration: string | null
}

export default function ExperiencePlanner() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    isCurrentlyAtKuriftu: null,
    selectedBranch: null,
    interests: [],
    groupType: null,
    duration: null,
  })

  const updatePreferences = (key: keyof UserPreferences, value: any) => {
    setUserPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNextStep = () => {
    // If user is not currently at Kuriftu and we're at duration step, skip it
    if (currentStep === 4 && userPreferences.isCurrentlyAtKuriftu === false) {
      generatePlan()
      return
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      generatePlan()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generatePlan = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowChat(true)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationStep
            value={userPreferences.isCurrentlyAtKuriftu}
            onChange={(value) => updatePreferences("isCurrentlyAtKuriftu", value)}
          />
        )
      case 2:
        return (
          <BranchStep
            value={userPreferences.selectedBranch}
            onChange={(value) => updatePreferences("selectedBranch", value)}
          />
        )
      case 3:
        return (
          <InterestStep
            values={userPreferences.interests}
            onChange={(value) => updatePreferences("interests", value)}
          />
        )
      case 4:
        return (
          <GroupTypeStep
            value={userPreferences.groupType}
            onChange={(value) => updatePreferences("groupType", value)}
          />
        )
      case 5:
        return (
          <DurationStep value={userPreferences.duration} onChange={(value) => updatePreferences("duration", value)} />
        )
      default:
        return null
    }
  }

  if (showChat) {
    return <ChatInterface userPreferences={userPreferences} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-800">
          Step {currentStep} of {userPreferences.isCurrentlyAtKuriftu === false ? 4 : 5}
        </h2>
        <div className="flex space-x-2">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="border-amber-600 text-amber-700 hover:bg-amber-50"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNextStep}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={
              (currentStep === 1 && userPreferences.isCurrentlyAtKuriftu === null) ||
              (currentStep === 2 && !userPreferences.selectedBranch) ||
              (currentStep === 3 && userPreferences.interests.length === 0) ||
              (currentStep === 4 && !userPreferences.groupType) ||
              (currentStep === 5 && !userPreferences.duration) ||
              isLoading
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : currentStep === (userPreferences.isCurrentlyAtKuriftu === false ? 4 : 5) ? (
              "Generate Plan"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>

      <Card className="p-6 border-amber-200">{renderStep()}</Card>
    </div>
  )
}
