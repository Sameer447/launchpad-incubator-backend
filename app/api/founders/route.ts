import { NextRequest } from 'next/server';
import { searchContacts, getFounderProperties, transformToFounderCardData } from '@/lib/hubspot/contacts';
import { getFounderAssociationLabelId } from '@/lib/hubspot/associations';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { ContactSearchRequest } from '@/lib/hubspot/types';

/**
 * GET /api/founders
 * Get all founders with their specific data
 * This endpoint filters contacts by the "founder" association label
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const cohort = searchParams.get('cohort');
    const status = searchParams.get('status');

    // Build search filters
    const filters: any[] = [];

    // Add cohort filter if provided
    if (cohort) {
      filters.push({
        propertyName: 'current_cohort',
        operator: 'EQ',
        value: cohort,
      });
    }

    // Add status filter if provided
    if (status) {
      filters.push({
        propertyName: 'application_status',
        operator: 'EQ',
        value: status,
      });
    }

    // Build search request
    const searchRequest: ContactSearchRequest = {
      filterGroups: filters.length > 0 ? [{ filters }] : [],
      properties: getFounderProperties(),
      limit: 100,
    };

    // Search contacts
    const results = await searchContacts(searchRequest);

    // Transform to founder card data
    const founders = results.results.map(contact => transformToFounderCardData(contact));

    return successResponse(
      {
        total: founders.length,
        founders,
        filters: {
          companyId: companyId || null,
          cohort: cohort || null,
          status: status || null,
        },
      },
      'Founders retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/founders
 * Advanced search for founders with custom filters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = [], limit = 100 } = body;

    // Build search request with founder properties
    const searchRequest: ContactSearchRequest = {
      filterGroups: filters.length > 0 ? [{ filters }] : [],
      properties: getFounderProperties(),
      limit,
    };

    const results = await searchContacts(searchRequest);
    const founders = results.results.map(contact => transformToFounderCardData(contact));

    return successResponse(
      {
        total: founders.length,
        founders,
      },
      'Founder search completed successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}