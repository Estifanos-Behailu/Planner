import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userPreferences, conversationHistory } = body

    if (!message && !userPreferences) {
      return NextResponse.json({ error: "Message or user preferences are required" }, { status: 400 })
    }

    // Get branch data and activities from the database
    const selectedBranch = userPreferences.selectedBranch || "bishoftu"
    const branchData = await db.getBranchById(selectedBranch)
    const branchActivities = await db.getActivitiesByBranch(selectedBranch)

    // Filter activities based on user interests if any are selected
    let relevantActivities = branchActivities
    if (userPreferences.interests && userPreferences.interests.length > 0) {
      const interestCategories: Record<string, string> = {
        relaxation: "Relaxation",
        culture: "Culture & Art",
        food: "Food & Drinks",
        water: "Water Fun",
        adventure: "Adventure",
        shopping: "Shopping",
      }

      const userInterestCategories = userPreferences.interests.map((i: string) => interestCategories[i])
      relevantActivities = branchActivities.filter((activity) => userInterestCategories.includes(activity.category))
    }

    // Format activities for the AI
    const activitiesInfo = relevantActivities
      .map(
        (activity) =>
          `- ${activity.name}: ${activity.description} (Duration: ${activity.duration} minutes, Category: ${activity.category})`,
      )
      .join("\n")

    // Format the conversation history for the AI
    const formattedHistory = conversationHistory || []

    // Create a system prompt that explains the context and provides information about Kuriftu
    const systemPrompt = `You are an AI assistant for Kuriftu Resort in Ethiopia. 
Your role is to help guests plan their perfect stay by recommending activities and answering questions.

Information about the user:
- Currently at Kuriftu: ${userPreferences.isCurrentlyAtKuriftu ? "Yes" : "No"}
- Selected Branch: ${branchData?.name || selectedBranch}
- Interests: ${userPreferences.interests.map((i: string) => i.charAt(0).toUpperCase() + i.slice(1)).join(", ") || "Not specified"}
- Group Type: ${userPreferences.groupType || "Not specified"}
- Duration of Stay: ${userPreferences.duration || "Not specified"}

Branch Information:
${branchData ? `${branchData.name}: ${branchData.description}` : "Branch information not available"}

Available Activities at ${branchData?.name || selectedBranch} that match the user's interests:
${activitiesInfo || "No specific activities found for the selected interests"}

Your task is to:
1. Create a personalized plan based on the available activities and user preferences
2. Answer questions about the resort and activities
3. Suggest modifications to the plan if requested
4. Be helpful, friendly, and knowledgeable about Ethiopian culture

If the user asks about activities not listed above, you can mention that they might not be available at this branch or don't match their selected interests.
If you don't know something specific, suggest they speak with resort staff.`

    // Use the AI SDK to generate a response
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: message,
        temperature: 0.7,
        maxTokens: 800,
      })

      return NextResponse.json({ response: text })
    } catch (aiError) {
      console.error("Error with AI service:", aiError)

      // Return the actual error instead of a fallback response
      const errorMessage = aiError instanceof Error ? aiError.message : 'An error occurred with the AI service';
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

// The fallback generator has been removed to ensure we only show actual AI responses
