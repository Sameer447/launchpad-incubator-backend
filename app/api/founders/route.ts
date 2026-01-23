import { NextRequest } from 'next/server';
import { getFounderProperties, transformToFounderCardData } from '@/lib/hubspot/contacts';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/founders
 * Get all founders associated with a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();
    
    console.log('Fetching associations for company:', companyId);

    // Use the v4 associations API which includes association type details
    const associationsResponse = await client.crm.associations.v4.basicApi.getPage(
      'companies',
      companyId,
      'contacts',
      undefined, // after
      500 // limit
    );

    console.log('V4 Associations found:', associationsResponse.results?.length || 0);

    if (!associationsResponse.results || associationsResponse.results.length === 0) {
      return successResponse(
        {
          total: 0,
          founders: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Founder associations
    // IMPORTANT: Match by label name AND category to avoid conflicts with HubSpot-defined labels
    const founderAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        // Match "Founder" label that is USER_DEFINED (not HUBSPOT_DEFINED)
        return at.label && 
               at.label.toLowerCase() === 'founder' && 
               at.category === 'USER_DEFINED';
      });
    });

    console.log(`Found ${founderAssociations.length} contacts with USER_DEFINED Founder label`);

    if (founderAssociations.length === 0) {
      // Log what labels were found for debugging
      const allLabels = associationsResponse.results.flatMap((assoc: any) => 
        assoc.associationTypes?.map((at: any) => `${at.label} (${at.category})`) || []
      );
      console.log('Available association labels:', [...new Set(allLabels)].join(', '));
      
      return successResponse(
        {
          total: 0,
          founders: [],
        },
        'No contacts with "Founder" label found. Please associate contacts using the Founder label in HubSpot.'
      );
    }

    const contactIds = founderAssociations.map((assoc: any) => assoc.toObjectId);
    console.log('Fetching details for Founder contact IDs:', contactIds);

    // Fetch contact details
    const contactPromises = contactIds.map(async (contactId) => {
      try {
        const contact = await client.crm.contacts.basicApi.getById(
          contactId,
          getFounderProperties()
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (error) {
        console.error('Error fetching contact:', contactId, error);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);
    console.log(`Successfully fetched ${contacts.length} founder contacts`);

    // Transform to founder card data
    const founders = contacts.map(contact => transformToFounderCardData(contact));

    return successResponse(
      {
        total: founders.length,
        founders,
      },
      'Founders retrieved successfully'
    );
  } catch (error) {
    console.error('Error in /api/founders:', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/founders
 * Advanced search for founders
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();

    // Get all contacts using v4 API
    const associationsResponse = await client.crm.associations.v4.basicApi.getPage(
      'companies',
      companyId,
      'contacts',
      undefined,
      500
    );

    if (!associationsResponse.results || associationsResponse.results.length === 0) {
      return successResponse(
        {
          total: 0,
          founders: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Founder associations
    const founderAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        return at.label && 
               at.label.toLowerCase() === 'founder' && 
               at.category === 'USER_DEFINED';
      });
    });

    const contactIds = founderAssociations.map((assoc: any) => assoc.toObjectId);

    // Fetch contacts
    const contactPromises = contactIds.map(async (contactId) => {
      try {
        const contact = await client.crm.contacts.basicApi.getById(
          contactId,
          getFounderProperties()
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (err) {
        console.error('Error fetching contact:', contactId, err);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);
    const founders = contacts.map(contact => transformToFounderCardData(contact));

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