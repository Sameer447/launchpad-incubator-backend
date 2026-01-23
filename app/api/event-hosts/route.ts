import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/event-hosts
 * Get all event hosts associated with a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return errorResponse('Company ID is required', 400);
    }

    const client = getHubSpotClient();
    
    console.log('Fetching event hosts for company:', companyId);

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
          eventHosts: [],
        },
        'No contacts found for this company'
      );
    }

    // Filter for Event Host associations (USER_DEFINED category)
    const eventHostAssociations = associationsResponse.results.filter((assoc: any) => {
      return assoc.associationTypes?.some((at: any) => {
        return at.label && 
               at.label.toLowerCase() === 'event host' && 
               at.category === 'USER_DEFINED';
      });
    });

    console.log(`Found ${eventHostAssociations.length} event hosts`);

    if (eventHostAssociations.length === 0) {
      return successResponse(
        {
          total: 0,
          eventHosts: [],
        },
        'No contacts with "Event Host" label found.'
      );
    }

    const contactIds = eventHostAssociations.map((assoc: any) => assoc.toObjectId);

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
            'event_host_organization_type',
            'events_hosted',
            'next_event',
          ]
        );
        return {
          id: contact.id,
          properties: contact.properties,
        };
      } catch (error) {
        console.error('Error fetching event host contact:', contactId, error);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);

    // Transform to event host card data
    const eventHosts = contacts.map(contact => {
      const { properties } = contact;
      return {
        id: contact.id,
        name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
        email: properties.email || 'N/A',
        phone: properties.phone || 'N/A',
        organizationType: properties.event_host_organization_type || 'N/A',
        eventsHosted: properties.events_hosted || '0',
        nextEvent: properties.next_event || null,
      };
    });

    return successResponse(
      {
        total: eventHosts.length,
        eventHosts,
      },
      'Event hosts retrieved successfully'
    );
  } catch (error) {
    console.error('Error in /api/event-hosts:', error);
    return handleApiError(error);
  }
}