import Stripe from 'stripe';

async function payment({
    stripe = new Stripe(process.env.stripe_key),
    payment_method_types = ["card"],
    mode = "payment",
    customer_email,
    metadata = {},
    success_url,
    cancel_url,
    line_items = [],
    discounts= []
} = {}) {
    stripe = new Stripe(process.env.stripe_key)
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts
    })

    return session
}

export default payment

// [{
//     price_data: {
//         currency: "egp",
//         product_data: {
//             name
//         },
//         unit_amount
//     },
//     quantity
// }]