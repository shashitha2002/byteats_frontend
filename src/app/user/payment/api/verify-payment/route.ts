// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const paymentIntentId = url.searchParams.get('payment_intent');
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Verifying payment intent: ${paymentIntentId}`);
    
    // Make the request to your backend
    const backendUrl = `http://localhost:5003/api/payment/verify/${paymentIntentId}`;
    console.log(`Calling backend URL: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Log the raw response status
    console.log(`Backend response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // Try to get the error content
      let errorContent;
      let contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorContent = await response.json();
          console.error('Backend error (JSON):', errorContent);
        } catch (e) {
          const text = await response.text();
          errorContent = { rawError: text };
          console.error('Backend error (Text):', text);
        }
      } else {
        const text = await response.text();
        errorContent = { rawError: text };
        console.error('Backend error (Text):', text);
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to verify payment status', 
          details: errorContent,
          status: response.status,
          statusText: response.statusText
        },
        { status: 500 }
      );
    }
    
    const responseText = await response.text();
    let data;
    
    // Try to parse the response safely
    try {
      // Check if the response is actually JSON
      if (responseText.trim()) {
        data = JSON.parse(responseText);
      } else {
        data = { status: 'success', message: 'Payment verified (empty response)' };
      }
    } catch (e) {
      console.error('Failed to parse backend response:', responseText);
      return NextResponse.json(
        { 
          error: 'Invalid response format from payment server',
          responseText: responseText.substring(0, 200) // Include part of the response for debugging
        },
        { status: 500 }
      );
    }
    
    console.log('Verification successful, returning:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}