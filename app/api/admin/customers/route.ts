import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: customers, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .order("last_order_at", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error("Customer lookup error:", error);

      return NextResponse.json(
        { error: "Could not load customers." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customers: customers || [],
    });
  } catch (error) {
    console.error("Admin customers error:", error);

    return NextResponse.json(
      { error: "Could not load customers." },
      { status: 500 }
    );
  }
}