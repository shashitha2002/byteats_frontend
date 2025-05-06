// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { orderId, totalPrice, currency, paymentMethodId } = requestData;

    // Validate the required fields
    if (!orderId || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Make a request to your backend API with the payment method ID included
    const response = await fetch('http://localhost:5003/api/payment/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        totalPrice,
        currency: currency || 'usd',
        paymentMethodId
      }),
    });

    if (!response.ok) {
      // Log the entire response for debugging
      console.error(`Response status: ${response.status} ${response.statusText}`);
      
      // Try to parse as JSON, if that fails, get the text
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Backend error: ${response.status}`;
      } catch (e) {
        const text = await response.text();
        errorMessage = `Backend error: ${response.status} - ${text.substring(0, 100)}...`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}