import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

export default function BillingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals just getting started",
      features: ["Basic features", "Limited storage", "Email support"],
    },
    {
      name: "Basic",
      price: "$9.99",
      description: "For small teams or projects",
      features: ["All Free features", "Unlimited storage", "Priority email support", "API access"],
    },
    {
      name: "Pro",
      price: "$14.99",
      description: "For professionals and growing businesses",
      features: [
        "All Basic features",
        "Advanced analytics",
        "24/7 phone support",
        "Custom integrations",
        "Team collaboration tools",
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-10">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.name === "Basic" ? "border-primary" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-3xl font-bold">{tier.price}/month</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{tier.description}</p>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.name === "Basic" ? "default" : "outline"}>
                  Select {tier.name} Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}