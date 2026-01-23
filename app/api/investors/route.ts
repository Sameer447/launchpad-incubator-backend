import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/investors
 * Get all investors associated with a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();
    
    console.log('Fetching investors for company:', companyId);

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
          investors: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Investor associations (USER_DEFINED category)
    const investorAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        return at.label && 
               at.label.toLowerCase() === 'investor' && 
               at.category === 'USER_DEFINED';
      });
    });

    console.log(`Found ${investorAssociations.length} investors`);

    if (investorAssociations.length === 0) {
      return successResponse(
        {
          total: 0,
          investors: [],
        },
        'No contacts with "Investor" label found.'
      );
    }

    const contactIds = investorAssociations.map((assoc: any) => assoc.toObjectId);

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
            'investor_focus',
            'investor_stage',
            'investor_ticket_size',
          ]
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (error) {
        console.error('Error fetching investor contact:', contactId, error);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);

    // Transform to investor card data
    const investors = contacts.map(contact => {
      const { properties } = contact;
      return {
        id: contact.id,
        name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
        email: properties.email || 'N/A',
        phone: properties.phone || 'N/A',
        investmentFocus: properties.investor_focus || 'N/A',
        investmentStage: properties.investor_stage || 'N/A',
        ticketSize: properties.investor_ticket_size || 'N/A',
      };
    });

    return successResponse(
      {
        total: investors.length,
        investors,
      },
      'Investors retrieved successfully'
    );
  } catch (error) {
    console.error('Error in /api/investors:', error);
    return handleApiError(error);
  }
}