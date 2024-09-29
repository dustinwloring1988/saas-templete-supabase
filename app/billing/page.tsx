'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { AuthWrapper } from "@/components/AuthWrapper"
import { supabase } from '@/lib/supabase'
import { createRecurringPayment, cancelSubscription } from '@/lib/stripe'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loadStripe } from '@stripe/stripe-js'

export default function BillingPage() {
  const [currentTier, setCurrentTier] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (subscription && !error) {
          setCurrentTier(subscription.tier)
        }
      }
    }

    fetchSubscription()
  }, [])

  const handleSubscription = async (tier: string, priceId: string) => {
    if (!userId) {
      setError('User not authenticated. Please log in and try again.')
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId, 
          userId,
          mode: 'subscription' // Explicitly set the mode to subscription
        }),
      })

      const responseText = await response.text()
      console.log('Raw server response:', responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        throw new Error(`Invalid server response: ${responseText.slice(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`)
      }

      const { sessionId } = responseData

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setError(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCancelSubscription = async () => {
    if (!userId || !currentTier) {
      setError('No active subscription to cancel')
      return
    }

    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (subscription) {
        await cancelSubscription(subscription.id)
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', end_date: new Date().toISOString() })
          .eq('id', subscription.id)

        setCurrentTier(null)
        setSuccess('Subscription successfully cancelled')
      }
    } catch (error) {
      setError('Failed to cancel subscription')
      console.error(error)
    }
  }

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals just getting started",
      features: ["Basic features", "Limited storage", "Email support"],
      priceId: null,
    },
    {
      name: "Basic",
      price: "$9.99",
      description: "For small teams or projects",
      features: ["All Free features", "Unlimited storage", "Priority email support", "API access"],
      priceId: "price_1Q4RU0Ai61MmRtb3fTMwEQBr", // Replace with your actual Stripe Price ID
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
      priceId: "price_1Q4RUNAi61MmRtb3p98xZBb7", // Replace with your actual Stripe Price ID
    },
  ]

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-10">Choose Your Plan</h2>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-6">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className={`flex flex-col ${tier.name === currentTier ? "border-primary" : ""}`}>
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
                  <Button 
                    className="w-full" 
                    variant={tier.name === currentTier ? "default" : "outline"}
                    disabled={tier.name === currentTier}
                    onClick={() => tier.priceId ? handleSubscription(tier.name, tier.priceId) : handleCancelSubscription()}
                  >
                    {tier.name === currentTier ? "Current Tier" : 
                     tier.name === "Free" && currentTier ? "Cancel Subscription" : 
                     `Select ${tier.name} Plan`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}