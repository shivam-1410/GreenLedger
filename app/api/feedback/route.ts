import { NextResponse } from 'next/server';

const MOCK_FEEDBACKS = [
  {
    id: 'fb-101',
    walletAddress: 'GBV2X55PLM4Q6K8W7N2R9T1Y3U5I7O9P2A4S6D8F0G2H4J6K8L0M2N4R4E91',
    userName: 'Elena Rostova (Sustainability Director)',
    rating: 5,
    category: 'UI/UX',
    comment: 'Seamless carbon credit purchasing flow with Freighter wallet. Loved the real-time event stream and instant certificate hash verification!',
    npsScore: 10,
    timestamp: Date.now() - 3600000 * 24 * 2,
    verifiedWallet: true,
  },
  {
    id: 'fb-102',
    walletAddress: 'GD72P44Q8W1E3R5T7Y9U2I4O6P8A0S2D4F6G8H0J2K4L6M8N0P2Q4R6K92L4',
    userName: 'Marcus Vance (ESG Analyst)',
    rating: 5,
    category: 'Transaction Speed',
    comment: 'Stellar Soroban RPC responses are sub-second. Atomic settlement in XLM worked without any retries. Highly recommended for enterprise compliance.',
    npsScore: 9,
    timestamp: Date.now() - 3600000 * 24 * 4,
    verifiedWallet: true,
  },
  {
    id: 'fb-103',
    walletAddress: 'GC31K99O8I7U6Y5T4R3E2W1Q0P9O8I7U6Y5T4R3E2W1Q0P9O8I7U6Y5T4R3',
    userName: 'Sophia Chen (EcoFund Manager)',
    rating: 5,
    category: 'Wallet Connection',
    comment: ' stellar-wallets-kit integration allows effortless switching between Albedo and Freighter. Great work on cross-contract verifier checks!',
    npsScore: 10,
    timestamp: Date.now() - 3600000 * 24 * 6,
    verifiedWallet: true,
  },
  {
    id: 'fb-104',
    walletAddress: 'GA88L22K4J6H8G0F2D4S6A8P0O2I4U6Y8T0R2E4W6Q8P0O2I4U6Y8T0R2E4',
    userName: 'David Miller (Climate Tech Founder)',
    rating: 4,
    category: 'Feature Request',
    comment: 'Would love automated recurring retirement schedules for corporate monthly CO2 offsets. Otherwise, UI is exceptionally responsive.',
    npsScore: 8,
    timestamp: Date.now() - 3600000 * 24 * 8,
    verifiedWallet: true,
  },
];

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      feedbacks: MOCK_FEEDBACKS,
      summary: {
        totalFeedbackCount: MOCK_FEEDBACKS.length,
        averageRating: 4.75,
        averageNps: 9.25,
        csatPercentage: 96,
      },
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, userName, rating, category, comment, npsScore } = body;

    if (!comment || !category) {
      return NextResponse.json(
        { success: false, error: 'Category and comment are required fields.' },
        { status: 400 }
      );
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      walletAddress: walletAddress || 'GBV2X...ANON',
      userName: userName || 'Anonymous Stellar User',
      rating: rating || 5,
      category: category || 'General',
      comment,
      npsScore: npsScore || 10,
      timestamp: Date.now(),
      verifiedWallet: !!walletAddress,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully! Thank you for validating GreenLedger Protocol.',
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }
}
