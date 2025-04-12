import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { branch, interests, groupType, duration, isCurrentlyAtKuriftu } = body

    if (!branch) {
      return NextResponse.json({ error: "Branch is required" }, { status: 400 })
    }

    // Get branch details
    const branchDetails = await db.getBranchById(branch)
    if (!branchDetails) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    // Get all activities for the selected branch
    const branchActivities = await db.getActivitiesByBranch(branch)

    // Filter by interests if provided
    let filteredActivities = branchActivities
    if (interests && interests.length > 0) {
      const interestCategories = {
        relaxation: "Relaxation",
        culture: "Culture & Art",
        food: "Food & Drinks",
        water: "Water Fun",
        adventure: "Adventure",
        shopping: "Shopping",
      }

      const userInterestCategories = interests.map((i: keyof typeof interestCategories): string => interestCategories[i])
      filteredActivities = branchActivities.filter((activity) => userInterestCategories.includes(activity.category))
    }

    // Sort activities by duration if duration preference is provided
    if (duration) {
      const durationMinutes = getDurationMinutes(duration)
      filteredActivities.sort((a, b) => {
        // Sort activities that fit within the duration first
        const aFits = a.duration <= durationMinutes
        const bFits = b.duration <= durationMinutes

        if (aFits && !bFits) return -1
        if (!aFits && bFits) return 1

        // Then sort by how close they are to the ideal duration
        return Math.abs(a.duration - durationMinutes / 2) - Math.abs(b.duration - durationMinutes / 2)
      })
    }

    // Try to use AI for recommendations
    try {
      // Format the activities for the AI
      const activitiesText = filteredActivities
        .map(
          (activity) =>
            `- ${activity.name}: ${activity.description} (Category: ${activity.category}, Duration: ${activity.duration} minutes)`,
        )
        .join("\n")

      // Create a prompt for the AI
      const prompt = `
I need to create a personalized itinerary for a visitor to Kuriftu Resort in ${branchDetails.name}, Ethiopia.

Visitor details:
- Currently at resort: ${isCurrentlyAtKuriftu ? "Yes" : "No"}
- Interests: ${interests ? interests.map((i: string) => i.charAt(0).toUpperCase() + i.slice(1)).join(", ") : "Not specified"}
- Group type: ${groupType || "Not specified"}
- Duration of stay: ${duration || "Not specified"}

Branch information:
${branchDetails.name}: ${branchDetails.description}

Available activities at this branch that match the visitor's interests:
${activitiesText || "No activities match the selected interests at this branch."}

Please create:
1. A detailed itinerary with specific activities from the database
2. A schedule that fits within their duration of stay
3. Personalized recommendations explaining why these activities would be good for them
4. Special considerations based on their group type

If there are no activities matching their interests, suggest alternatives from the available activities at this branch.
`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.7,
        maxTokens: 800,
      })

      // Return the AI-generated recommendations along with the filtered activities
      return NextResponse.json({
        branch: branchDetails,
        activities: filteredActivities,
        recommendations: text,
      })
    } catch (aiError) {
      console.error("Error with AI service:", aiError)

      // Fall back to the rule-based recommendations if AI fails
      return NextResponse.json({
        branch: branchDetails,
        activities: filteredActivities,
        recommendations: generateRecommendations(filteredActivities, groupType, isCurrentlyAtKuriftu, duration),
      })
    }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

// Helper function to convert duration preference to minutes
function getDurationMinutes(duration: string): number {
  switch (duration) {
    case "short":
      return 120 // Less than 2 hours
    case "half-day":
      return 240 // 4 hours
    case "full-day":
      return 480 // 8 hours
    case "multi-day":
      return 1440 // 24 hours (1 day)
    default:
      return 240 // Default to half-day
  }
}

// Enhanced fallback recommendation generator
function generateRecommendations(
  activities: any[],
  groupType: string | null,
  isCurrentlyAtKuriftu: boolean | null,
  duration: string | null,
): string {
  if (activities.length === 0) {
    return "We don't have activities matching your exact interests at this branch. Consider exploring other interests or asking our staff for recommendations when you arrive."
  }

  let recommendations = "# Your Personalized Kuriftu Experience\n\n"

  // Add introduction
  recommendations += "Based on your preferences, I've created a personalized plan for your visit.\n\n"

  // Add schedule based on duration
  if (duration) {
    recommendations += "## Recommended Schedule\n\n"

    const durationMinutes = getDurationMinutes(duration)
    let remainingTime = durationMinutes
    const scheduledActivities = []

    // Try to fit activities within the duration
    for (const activity of activities) {
      if (activity.duration <= remainingTime) {
        scheduledActivities.push(activity)
        remainingTime -= activity.duration
      }

      // Stop if we've scheduled 5 activities or have less than 30 minutes left
      if (scheduledActivities.length >= 5 || remainingTime < 30) break
    }

    if (scheduledActivities.length === 0) {
      // If no activities fit, recommend the shortest one
      const shortestActivity = [...activities].sort((a, b) => a.duration - b.duration)[0]
      if (shortestActivity) {
        scheduledActivities.push(shortestActivity)
      }
    }

    // Create schedule
    let currentTime = 9 * 60 // Start at 9 AM (in minutes)
    scheduledActivities.forEach((activity, index) => {
      const startHour = Math.floor(currentTime / 60)
      const startMinute = currentTime % 60
      const endTime = currentTime + activity.duration
      const endHour = Math.floor(endTime / 60)
      const endMinute = endTime % 60

      const startTimeStr = `${startHour}:${startMinute.toString().padStart(2, "0")}`
      const endTimeStr = `${endHour}:${endMinute.toString().padStart(2, "0")}`

      recommendations += `### ${startTimeStr} - ${endTimeStr}: ${activity.name}\n`
      recommendations += `${activity.description}\n`
      recommendations += `- Duration: ${activity.duration} minutes\n`
      recommendations += `- Category: ${activity.category}\n\n`

      currentTime = endTime + 30 // Add 30 minute break between activities
    })
  } else {
    // If no duration specified, just list top activities
    recommendations += "## Recommended Activities\n\n"

    const topActivities = activities.slice(0, 5)
    topActivities.forEach((activity, index) => {
      recommendations += `### ${index + 1}. ${activity.name}\n`
      recommendations += `${activity.description}\n`
      recommendations += `- Duration: ${activity.duration} minutes\n`
      recommendations += `- Category: ${activity.category}\n\n`
    })
  }

  // Add group-specific recommendations
  if (groupType) {
    recommendations += "## Special Recommendations\n\n"

    switch (groupType) {
      case "solo":
        recommendations +=
          "As a solo traveler, you might enjoy our guided experiences where you can meet other guests. Our staff can provide personalized attention to make your experience special.\n\n"
        break
      case "couple":
        recommendations +=
          "For couples, we recommend our romantic sunset experiences and private dining options. Consider booking a private session for activities like the Ethiopian Coffee Ceremony for a more intimate experience.\n\n"
        break
      case "family":
        recommendations +=
          "Families love our guided nature walks and cultural activities suitable for all ages. We can provide modified versions of activities to accommodate children of different ages.\n\n"
        break
      case "friends":
        recommendations +=
          "Groups of friends might enjoy our adventure activities and evening entertainment options. We can arrange group rates for certain activities and private spaces for your group to relax together.\n\n"
        break
    }
  }

  // Add booking information
  if (isCurrentlyAtKuriftu !== null) {
    recommendations += "## Booking Information\n\n"

    if (isCurrentlyAtKuriftu) {
      recommendations +=
        "Since you're already here, our staff at the reception can help you book these activities immediately. We recommend booking as soon as possible to secure your preferred time slots.\n\n"
    } else {
      recommendations +=
        "We recommend booking these activities in advance for your upcoming visit. You can contact our reservation desk to pre-book any of these experiences before your arrival.\n\n"
    }
  }

  recommendations +=
    "Would you like to modify this plan or get more details about any of the activities? I'm here to help you create the perfect Kuriftu experience!"

  return recommendations
}
