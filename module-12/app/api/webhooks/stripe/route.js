import { stripe } from "@/modules/stripe/config/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("📥 Webhook received");

    if (!signature) {
      console.error("❌ No signature");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      console.log("✅ Event verified:", event.type);
    } catch (err) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        console.log("🎉 Checkout completed for user:", userId);

        if (userId && session.customer) {
          await db.user.update({
            where: { id: userId },
            data: {
              plan: "PREMIUM",
              stripeCustomerId: session.customer,
            },
          });

          console.log(`✅ User ${userId} upgraded to PREMIUM`);
        } else {
          console.warn("⚠️ Missing userId or customer");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log("🔻 Subscription deleted:", customerId);

        const user = await db.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: { plan: "FREE" },
          });

          console.log(`⬇️ User ${user.id} downgraded to FREE`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log("🔄 Subscription updated:", customerId);

        if (subscription.status === "active") {
          const user = await db.user.findUnique({
            where: { stripeCustomerId: customerId },
          });

          if (user && user.plan !== "PREMIUM") {
            await db.user.update({
              where: { id: user.id },
              data: { plan: "PREMIUM" },
            });
            console.log(`✅ User ${user.id} subscription activated`);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`❌ Error handling webhook:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 },
    );
  }
}
