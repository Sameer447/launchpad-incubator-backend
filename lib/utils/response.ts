import { NextResponse } from 'next/server';
import { APIResponse } from '../hubspot/types';

/**
 * Create standardized success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Create standardized error response
 */
export function errorResponse(
  error: string,
  status: number = 400
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse<APIResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // HubSpot API specific errors
    if (error.message.includes('unauthorized') || error.message.includes('401')) {
      return errorResponse('Unauthorized: Invalid HubSpot credentials', 401);
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return errorResponse('Resource not found', 404);
    }

    if (error.message.includes('rate limit')) {
      return errorResponse('Rate limit exceeded. Please try again later.', 429);
    }

    return errorResponse(error.message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}