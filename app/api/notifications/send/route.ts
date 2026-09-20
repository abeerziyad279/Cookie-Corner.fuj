import { NextResponse } from "next/server";
import webpush from "web-push";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabase/server";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = body.title?.trim();
    const message = body.message?.trim();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required." },
        { status: 400 }
      );
    }

    const { data: subscriptions, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("*")
      .eq("subscriber_type", "customer");

    if (error) {
      console.error("Subscription lookup error:", error);

      return NextResponse.json(
        { error: "Could not load customer subscriptions." },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No customers have notifications enabled yet." },
        { status: 404 }
      );
    }

    const payload = JSON.stringify({
      title,
      body: message,
      url: "/",
    });

    let sent = 0;

    for (const item of subscriptions) {
      try {
        await webpush.sendNotification(
          item.subscription,
          payload
        );

        sent++;
      } catch (error) {
        console.error(
          "Could not send customer notification:",
          error
        );

        if (
          error &&
          typeof error === "object"
        ) {
          console.error(
            "Notification error details:",
            JSON.stringify(error, null, 2)
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent,
    });
  } catch (error) {
    console.error(
      "Custom notification error:",
      error
    );

    return NextResponse.json(
      { error: "Could not send notification." },
      { status: 500 }
    );
  }
}