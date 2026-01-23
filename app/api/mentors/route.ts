import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/mentors
 * Get all mentors associated with a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();
    
    console.log('Fetching mentors for company:', companyId);

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
          mentors: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Mentor associations (USER_DEFINED category)
    const mentorAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        return at.label && 
               at.label.toLowerCase() === 'mentor' && 
               at.category === 'USER_DEFINED';
      });
    });

    console.log(`Found ${mentorAssociations.length} mentors`);

    if (mentorAssociations.length === 0) {
      return successResponse(
        {
          total: 0,
          mentors: [],
        },
        'No contacts with "Mentor" label found.'
      );
    }

    const contactIds = mentorAssociations.map((assoc: any) => assoc.toObjectId);

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
            'mentor_expertise',
            'mentor_availability',
            'mentor_sessions_completed',
          ]
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (error) {
        console.error('Error fetching mentor contact:', contactId, error);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);

    // Transform to mentor card data
    const mentors = contacts.map(contact => {
      const { properties } = contact;
      return {
        id: contact.id,
        name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
        email: properties.email || 'N/A',
        phone: properties.phone || 'N/A',
        expertise: properties.mentor_expertise || 'N/A',
        availability: properties.mentor_availability || 'N/A',
        sessionsCompleted: properties.mentor_sessions_completed || '0',
      };
    });

    return successResponse(
      {
        total: mentors.length,
        mentors,
      },
      'Mentors retrieved successfully'
    );
  } catch (error) {
    console.error('Error in /api/mentors:', error);
    return handleApiError(error);
  }
}