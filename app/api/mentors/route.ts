import { NextRequest } from 'next/server';
import { getContactById } from '@/lib/hubspot/contacts';
import { successResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/mentors
 * Get all mentors with their specific data
 * This endpoint filters contacts by the "mentor" association label
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    let contactResults: any[] = [];

    if (companyId) {
      const client = getHubSpotClient();
      
      console.log('Fetching mentor associations for company:', companyId);
      
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
                'mentor_expertise',
                'mentor_availability',
                'mentor_sessions_completed',
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

    // Transform to mentor card data
    const mentors = contactResults.map(contact => {
      const { properties } = contact;
      return {
        id: contact.id,
        name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
        email: properties.email || 'N/A',
        phone: properties.phone || 'N/A',
        expertise: properties.mentor_expertise || 'N/A',
        availability: properties.mentor_availability || 'N/A',
        sessionsCompleted: properties.mentor_sessions_completed || 'N/A',
      };
    });

    return successResponse(
      {
        total: mentors.length,
        mentors,
        filters: {
          companyId: companyId || null,
        },
      },
      'Mentors retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
