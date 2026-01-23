import { NextRequest } from 'next/server';
import { getContactById } from '@/lib/hubspot/contacts';
import { successResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/investors
 * Get all investors with their specific data
 * This endpoint filters contacts by the "investor" association label
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    let contactResults: any[] = [];

    if (companyId) {
      const client = getHubSpotClient();
      
      console.log('Fetching investor associations for company:', companyId);
      
      const associations = await client.crm.associations.batchApi.read(
        'companies',
        'contacts',
        {
          inputs: [{ id: companyId }],
        }
      );
      
      const results = associations.results || [];
      
      if (results.length > 0) {
        const toArray = results[0].to || [];
        
        if (toArray.length > 0) {
          console.log(`Found ${toArray.length} associated contacts`);
          
          const contactPromises = toArray.map(async (assoc: any) => {
            try {
              const contactId = assoc.toObjectId || assoc.id;
              return await getContactById(String(contactId), [
                'firstname',
                'lastname',
                'email',
                'phone',
                'investor_focus',
                'investor_stage',
                'investor_ticket_size',
              ]);
            } catch (error) {
              console.error('Error fetching contact:', error);
              return null;
            }
          });

          const contacts = await Promise.all(contactPromises);
          contactResults = contacts.filter(c => c !== null);
        }
      }
    }

    // Transform to investor card data
    const investors = contactResults.map(contact => {
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
        filters: {
          companyId: companyId || null,
        },
      },
      'Investors retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
