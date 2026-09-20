import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { subscription, subscriberType } = body;

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        {
          endpoint: subscription.endpoint,
          subscription: subscription,
          subscriber_type:
            subscriberType === "admin" ? "admin" : "customer",
        },
        {
          onConflict: "endpoint",
        }
      );

    if (error) {
      console.error("Push subscription error:", error);

      return NextResponse.json(
        { error: "Could not save subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Notification subscription error:", error);

    return NextResponse.json(
      { error: "Could not save notification subscription." },
      { status: 500 }
    );
  }
}