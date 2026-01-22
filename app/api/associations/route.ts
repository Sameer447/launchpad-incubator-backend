import { NextRequest } from 'next/server';
import {
  getContactAssociations,
  getContactsByAssociationLabel,
  getContactCompanyAssociationLabels,
} from '@/lib/hubspot/associations';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { isValidHubSpotId } from '@/lib/utils/validation';

/**
 * GET /api/associations
 * Get association labels or contacts by label
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contactId = searchParams.get('contactId');
    const label = searchParams.get('label');
    const companyId = searchParams.get('companyId');
    const listLabels = searchParams.get('listLabels') === 'true';

    // List all association labels
    if (listLabels) {
      const labels = await getContactCompanyAssociationLabels();
      return successResponse(
        { labels },
        'Association labels retrieved successfully'
      );
    }

    // Get associations for a specific contact
    if (contactId) {
      if (!isValidHubSpotId(contactId)) {
        return errorResponse('Invalid contact ID format', 400);
      }

      const associations = await getContactAssociations(contactId);
      return successResponse(
        { contactId, associations },
        'Contact associations retrieved successfully'
      );
    }

    // Get contacts by association label
    if (label) {
      const contactIds = await getContactsByAssociationLabel(label, companyId || undefined);
      return successResponse(
        { label, contactIds },
        'Contacts by label retrieved successfully'
      );
    }

    return errorResponse('Missing required parameters. Provide contactId, label, or set listLabels=true', 400);
  } catch (error) {
    return handleApiError(error);
  }
}