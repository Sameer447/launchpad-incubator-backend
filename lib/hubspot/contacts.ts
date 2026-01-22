import { getHubSpotClient } from './client';
import {
  HubSpotContact,
  ContactSearchRequest,
  ContactSearchResponse,
  FounderCardData,
} from './types';

/**
 * Search contacts with filters
 */
export async function searchContacts(
  searchRequest: ContactSearchRequest
): Promise<ContactSearchResponse> {
  try {
    const client = getHubSpotClient();
    
    // Build the search request in the format HubSpot expects
    const hubspotSearchRequest: any = {
      filterGroups: searchRequest.filterGroups || [],
      properties: searchRequest.properties || [],
      limit: searchRequest.limit || 100,
      after: searchRequest.after,
      sorts: searchRequest.sorts || [],
    };

    const response = await client.crm.contacts.searchApi.doSearch(hubspotSearchRequest);

    return {
      total: response.total,
      results: response.results.map(contact => ({
        id: contact.id,
        properties: contact.properties,
      })),
      paging: response.paging,
    };
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw error;
  }
}

/**
 * Get contact by ID with specific properties
 */
export async function getContactById(
  contactId: string,
  properties?: string[]
): Promise<HubSpotContact> {
  try {
    const client = getHubSpotClient();
    // Use getFounderProperties if no properties specified    
    const propsToFetch = properties || getFounderProperties();
    
    const contact = await client.crm.contacts.basicApi.getById(
      contactId,
      propsToFetch,
      undefined,
      undefined
    );

    return {
      id: contact.id,
      properties: contact.properties,
    };
  } catch (error) {
    console.error(`Error fetching contact ${contactId}:`, error);
    throw error;
  }
}

/**
 * Update contact properties
 */
export async function updateContact(
  contactId: string,
  properties: Record<string, any>
): Promise<HubSpotContact> {
  try {
    const client = getHubSpotClient();
    const contact = await client.crm.contacts.basicApi.update(contactId, {
      properties,
    });

    return {
      id: contact.id,
      properties: contact.properties,
    };
  } catch (error) {
    console.error(`Error updating contact ${contactId}:`, error);
    throw error;
  }
}

/**
 * Get all contacts with pagination support
 */
export async function getAllContacts(
  limit: number = 100,
  properties?: string[]
): Promise<HubSpotContact[]> {
  try {
    const client = getHubSpotClient();
    const allContacts: HubSpotContact[] = [];
    let after: string | undefined = undefined;

    do {
      const response = await client.crm.contacts.basicApi.getPage(
        limit,
        after,
        properties
      );
      
      allContacts.push(
        ...response.results.map(contact => ({
          id: contact.id,
          properties: contact.properties,
        }))
      );

      after = response.paging?.next?.after;
    } while (after);

    return allContacts;
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    throw error;
  }
}

/**
 * Transform HubSpot contact to Founder card data
 */
export function transformToFounderCardData(contact: HubSpotContact): FounderCardData {
  const { properties } = contact;
  // console.log('properties ===> ', properties);
  
  return {
    id: contact.id,
    name: `${properties.firstname || ''} ${properties.lastname || ''}`.trim() || 'N/A',
    email: properties.email || 'N/A',
    phone: properties.phone || 'N/A',
    applicationStatus: properties.onboarding_status || 'N/A',
    depositStatus: properties.payment_status || 'N/A',
    onboardingStage: properties.onboarding_status || 'Not Started',
    currentCohort: properties?.current_cohort || properties?.cohort || 'N/A',
    nextSteps: properties.next_step || 'No action required',
  };
}

/**
 * Get founder-specific properties list
 */
export function getFounderProperties(): string[] {
  return [
    'firstname',
    'lastname',
    'email',
    'phone',
    'application_status',
    'onboarding_status',
    'payment_status',
    'next_step',
    'current_cohort',
  ];
}