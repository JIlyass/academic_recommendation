import { BookOpen, Brain, BarChart3 } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI analyzes your interests, strengths, and academic history to provide personalized recommendations.",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Database",
      description: "Access information about thousands of academic programs and specializations across the globe.",
    },
    {
      icon: BarChart3,
      title: "Career Insights",
      description: "Get detailed insights about career prospects and job market trends for each specialty.",
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Academic Recommendation?</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to make informed decisions about your academic future.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-card theme-transition hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
