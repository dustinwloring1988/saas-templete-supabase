import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
})

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Set the mode to subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?canceled=true`,
      client_reference_id: userId,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the checkout session.' },
      { status: 500 }
    )
  }
}
