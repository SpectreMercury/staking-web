import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.gateio.ws/api/v4/spot/tickers?currency_pair=HSK_USDT', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data && data[0] && data[0].last) {
      return NextResponse.json({ price: parseFloat(data[0].last) });
    } else {
      return NextResponse.json({ price: 1.0 });
    }
  } catch (error) {
    console.error('Error fetching HSK price:', error);
    return NextResponse.json({ price: 1.0 });
  }
} 