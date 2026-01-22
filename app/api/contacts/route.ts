import { NextRequest } from 'next/server';
import { searchContacts, getAllContacts } from '@/lib/hubspot/contacts';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { validateRequest, ContactSearchSchema } from '@/lib/utils/validation';

/**
 * GET /api/contacts
 * Get all contacts or search with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const properties = searchParams.get('properties')?.split(',');

    const contacts = await getAllContacts(limit, properties);

    return successResponse(
      {
        total: contacts.length,
        contacts,
      },
      'Contacts retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/contacts
 * Search contacts with advanced filters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = validateRequest(ContactSearchSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    const searchRequest = validation.data;
    const results = await searchContacts(searchRequest);

    return successResponse(
      results,
      'Contact search completed successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}