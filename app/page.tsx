import { Suspense } from "react"
import ExperiencePlanner from "@/components/experience-planner"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Kuriftu Resort Experience Planner</h1>
          <p className="text-amber-700">Discover the perfect activities for your stay</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            }
          >
            <ExperiencePlanner />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
