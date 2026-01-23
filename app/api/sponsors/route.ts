import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/sponsors
 * Get all sponsors associated with a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();
    
    console.log('Fetching sponsors for company:', companyId);

    // Use v4 API to get associations with type details
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
          sponsors: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Sponsor associations (USER_DEFINED category)
    const sponsorAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        return at.label && 
               at.label.toLowerCase() === 'sponsor' && 
               at.category === 'USER_DEFINED';
      });
    });

    console.log(`Found ${sponsorAssociations.length} sponsors`);

    if (sponsorAssociations.length === 0) {
      return successResponse(
        {
          total: 0,
          sponsors: [],
        },
        'No contacts with "Sponsor" label found.'
      );
    }

    const contactIds = sponsorAssociations.map((assoc: any) => assoc.toObjectId);

    // Fetch contact details
    const contactPromises = contactIds.map(async (contactId) => {
      try {
        const contact = await client.crm.contacts.basicApi.getById(
          contactId,
          [
            'firstname',
            'lastname',
            'email',
            'phone',
            'sponsorship_level',
            'contribution_amount',
            'sponsorship_status',
          ]
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (error) {
        console.error('Error fetching sponsor contact:', contactId, error);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);

    // Transform to sponsor card data
    const sponsors = contacts.map(contact => {
      const { properties } = contact;
      return {
        id: contact.id,
        name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
        email: properties.email || 'N/A',
        phone: properties.phone || 'N/A',
        sponsorshipLevel: properties.sponsorship_level || 'N/A',
        contributionAmount: properties.contribution_amount || '0',
        sponsorshipStatus: properties.sponsorship_status || 'Active',
      };
    });

    return successResponse(
      {
        total: sponsors.length,
        sponsors,
      },
      'Sponsors retrieved successfully'
    );
  } catch (error) {
    console.error('Error in /api/sponsors:', error);
    return handleApiError(error);
  }
}