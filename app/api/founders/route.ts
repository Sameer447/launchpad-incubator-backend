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

    // Try to get the Founder label type ID
    let founderTypeId: number | null = null;
    
    try {
      const labelDefs = await client.crm.associations.v4.schema.definitionsApi.getAll(
        'companies',
        'contacts'
      );
      
      console.log('Association labels:', labelDefs.results.map((l: any) => ({ 
        label: l.label, 
        typeId: l.typeId 
      })));
      
      const founderLabel = labelDefs.results.find(
        (label: any) => label.label && label.label.toLowerCase() === 'founder'
      );
      
      if (founderLabel) {
        founderTypeId = founderLabel.typeId;
        console.log('Found Founder label with typeId:', founderTypeId);
      }
    } catch (err) {
      console.error('Error fetching labels:', err);
    }

    // Filter for Founder associations
    let contactIds: string[];
    
    if (founderTypeId !== null) {
      // Filter by the Founder association type
      const founderAssociations = associationsResponse.results.filter((assoc: any) => {
        // Check all associationType entries
        return assoc.associationTypes?.some((at: any) => at.typeId === founderTypeId);
      });
      
      console.log(`Found ${founderAssociations.length} Founder associations`);
      contactIds = founderAssociations.map((assoc: any) => assoc.toObjectId);
    } else {
      // No Founder label found - return all contacts
      console.log('No Founder label found, returning all contacts');
      contactIds = associationsResponse.results.map((assoc: any) => assoc.toObjectId);
    }

    if (contactIds.length === 0) {
      return successResponse(
        {
          total: 0,
          founders: [],
        },
        'No contacts with "Founder" label found. Please associate contacts with the Founder label.'
      );
    }

    console.log('Fetching details for contact IDs:', contactIds);

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
    console.log(`Successfully fetched ${contacts.length} contacts`);

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

    const contactIds = associationsResponse.results.map((assoc: any) => assoc.toObjectId);

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