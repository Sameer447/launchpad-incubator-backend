import { NextRequest } from 'next/server';
import { getContactById, updateContact } from '@/lib/hubspot/contacts';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { validateRequest, ContactIdSchema, UpdateContactSchema, isValidHubSpotId } from '@/lib/utils/validation';

/**
 * GET /api/contacts/[id]
 * Get contact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    // Validate contact ID
    const validation = validateRequest(ContactIdSchema, id);
    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    if (!isValidHubSpotId(id)) {
      return errorResponse('Invalid contact ID format', 400);
    }

    const searchParams = request.nextUrl.searchParams;
    const properties = searchParams.get('properties')?.split(',');

    const contact = await getContactById(id, properties);

    return successResponse(
      contact,
      'Contact retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/contacts/[id]
 * Update contact properties
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    // Validate contact ID
    if (!isValidHubSpotId(id)) {
      return errorResponse('Invalid contact ID format', 400);
    }

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(UpdateContactSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    const updatedContact = await updateContact(id, validation.data.properties);

    return successResponse(
      updatedContact,
      'Contact updated successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}