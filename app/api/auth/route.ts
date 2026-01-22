import { NextRequest } from 'next/server';
import { verifyHubSpotConnection, getAccountInfo } from '@/lib/hubspot/client';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';

/**
 * GET /api/auth
 * Verify HubSpot authentication and return account info
 */
export async function GET(request: NextRequest) {
  try {
    const isConnected = await verifyHubSpotConnection();

    if (!isConnected) {
      return errorResponse('Failed to connect to HubSpot. Please check your credentials.', 401);
    }

    const accountInfo = await getAccountInfo();

    return successResponse(
      {
        connected: true,
        account: accountInfo,
      },
      'Successfully connected to HubSpot'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/auth
 * Test authentication with provided token (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return errorResponse('Token is required', 400);
    }

    // Here you could test with a different token if needed
    // For now, we'll just verify the existing connection
    const isConnected = await verifyHubSpotConnection();

    return successResponse(
      { authenticated: isConnected },
      isConnected ? 'Authentication successful' : 'Authentication failed'
    );
  } catch (error) {
    return handleApiError(error);
  }
}