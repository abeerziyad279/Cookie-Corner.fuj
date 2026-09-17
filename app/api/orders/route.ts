import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      location,
      method,
      area,
      date,
      payment,
      gift,
      notes,
      subtotal,
      giftFee,
      deliveryFee,
      total,
      items,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const { data: existingCustomer, error: customerLookupError } =
      await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();

    if (customerLookupError) {
      throw customerLookupError;
    }

    let customerId: string;

    if (existingCustomer) {
      const { data: updatedCustomer, error: updateError } =
        await supabaseAdmin
          .from("customers")
          .update({
            name,
            location,
            order_count: existingCustomer.order_count + 1,
            last_order_at: new Date().toISOString(),
          })
          .eq("id", existingCustomer.id)
          .select()
          .single();

      if (updateError) throw updateError;

      customerId = updatedCustomer.id;
    } else {
      const { data: newCustomer, error: insertCustomerError } =
        await supabaseAdmin
          .from("customers")
          .insert({
            name,
            phone,
            location,
            order_count: 1,
            last_order_at: new Date().toISOString(),
          })
          .select()
          .single();

      if (insertCustomerError) throw insertCustomerError;

      customerId = newCustomer.id;
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_name: name,
        customer_phone: phone,
        order_method: method,
        area,
        delivery_location: location,
        order_date: date || null,
        payment_method: payment,
        gift: gift ?? false,
        notes: notes || null,
        subtotal: subtotal ?? 0,
        gift_fee: giftFee ?? 0,
        delivery_fee: deliveryFee ?? 0,
        total: total ?? 0,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (Array.isArray(items) && items.length > 0) {
      const orderItems = items.map(
        (item: {
          id?: string;
          name: string;
          price: number;
          quantity: number;
          itemCount?: number;
          details?: string;
          itemType?: string;
        }) => ({
          order_id: order.id,
          item_id: item.id || null,
          item_name: item.name,
          item_type: item.itemType || null,
          price: item.price,
          quantity: item.quantity,
          item_count: item.itemCount || null,
          details: item.details || null,
        })
      );

      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({
      success: true,
      customerId,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order save error:", error);

    return NextResponse.json(
      { error: "Failed to save order." },
      { status: 500 }
    );
  }
}