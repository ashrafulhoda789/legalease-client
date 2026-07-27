import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        // Form data capture
        const formData = await req.formData()
        const hiringId = formData.get('hiringId')
        const fee = Number(formData.get('fee')) 
        const lawyerName = formData.get('lawyerName')
        const lawyerEmail = formData.get('lawyerEmail') 

        if (!fee || fee <= 0) {
            return NextResponse.json({ error: 'Invalid fee amount' }, { status: 400 })
        }

        // Stripe Checkout Session Create
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Legal Consultation Fee - ${lawyerName}`,
                            description: `Consultation session with ${lawyerName}`,
                        },
                        unit_amount: Math.round(fee * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
           
            metadata: {
                hiringId: hiringId || '',
                lawyerName: lawyerName || 'N/A',
                lawyerEmail: lawyerEmail || 'N/A',
            },
            success_url: `${origin}/dashboard/user/hiring-history/success?session_id={CHECKOUT_SESSION_ID}&hiring_id=${hiringId}`,
            cancel_url: `${origin}/dashboard/user/hiring-history`,
        })

        return NextResponse.redirect(session.url, 303)
    } catch (err) {
        console.error("Checkout Error:", err)
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}