import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, location } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const { data: existingCustomer, error: lookupError } =
      await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();

    if (lookupError) {
      console.error("Customer lookup error:", lookupError);

      return NextResponse.json(
        { error: lookupError.message },
        { status: 500 }
      );
    }

    if (existingCustomer) {
      const { data: customer, error: updateError } =
        await supabaseAdmin
          .from("customers")
          .update({
            name,
            location: location || null,
          })
          .eq("id", existingCustomer.id)
          .select()
          .single();

      if (updateError) {
        console.error("Customer update error:", updateError);

        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        customer,
      });
    }

    const { data: customer, error: insertError } =
      await supabaseAdmin
        .from("customers")
        .insert({
          name,
          phone,
          location: location || null,
          order_count: 0,
          last_order_at: null,
        })
        .select()
        .single();

    if (insertError) {
      console.error("Customer insert error:", insertError);

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Customer API error:", error);

    return NextResponse.json(
      { error: "Failed to save customer." },
      { status: 500 }
    );
  }
}