import { NextRequest } from 'next/server';
import { searchContacts, getFounderProperties, transformToFounderCardData, getContactById } from '@/lib/hubspot/contacts';
import { getFounderAssociationLabelId } from '@/lib/hubspot/associations';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { ContactSearchRequest } from '@/lib/hubspot/types';
import { getHubSpotClient } from '@/lib/hubspot/client';

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

    let contactResults: any[] = [];

    // If companyId is provided, fetch contacts associated with that company
    if (companyId) {
      const client = getHubSpotClient();
      
      console.log('Fetching associations for company:', companyId);
      
      // Get all contacts associated with this company
      const associations = await client.crm.associations.batchApi.read(
        'companies',
        'contacts',
        {
          inputs: [{ id: companyId }],
        }
      );
      
      console.log('Raw associations response:', JSON.stringify(associations, null, 2));
      
      const results = associations.results || [];
      console.log('Results array length:', results.length);
      
      if (results.length > 0) {
        const firstResult = results[0];
        console.log('First result structure:', Object.keys(firstResult));
        console.log('First result.to:', firstResult.to);
        console.log('First result:', JSON.stringify(firstResult, null, 2));
        
        const toArray = firstResult.to || [];
        
        if (toArray.length > 0) {
          console.log(`Found ${toArray.length} associated contacts`);
          
          // Fetch each contact with founder properties
          const contactPromises = toArray.map(async (assoc: any) => {
            try {
              const contactId = assoc.toObjectId || assoc.id;
              console.log('Fetching contact ID:', contactId);
              return await getContactById(String(contactId), getFounderProperties());
            } catch (error) {
              console.error('Error fetching contact:', error);
              return null;
            }
          });

          const contacts = await Promise.all(contactPromises);
          contactResults = contacts.filter(c => c !== null);
          console.log(`Successfully fetched ${contactResults.length} contacts`);
        } else {
          console.log('No associated contacts found in to array');
        }
      } else {
        console.log('No results in associations response');
      }
    } else {
      // Build search filters for non-company queries
      const filters: any[] = [];

      // Add cohort filter if provided
      if (cohort) {
        filters.push({
          propertyName: 'cohort',
          operator: 'EQ',
          value: cohort,
        });
      }

      // Add status filter if provided
      if (status) {
        filters.push({
          propertyName: 'onboarding_status',
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
      console.log('searchRequest ===> ', searchRequest);
      
      // Search contacts
      const results = await searchContacts(searchRequest);
      contactResults = results.results;
    }    
    // Transform to founder card data
    // console.log('contactResults ===> ', contactResults);
    
    const founders = contactResults.map(contact => transformToFounderCardData(contact));

    // console.log('founders result === > ', founders);
    

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