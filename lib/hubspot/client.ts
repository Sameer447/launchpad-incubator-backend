import { Client } from '@hubspot/api-client';

// Singleton HubSpot client instance
let hubspotClient: Client | null = null;

/**
 * Initialize and return HubSpot client
 * Uses singleton pattern to reuse the same client instance
 */
export function getHubSpotClient(): Client {
  if (!hubspotClient) {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('HUBSPOT_ACCESS_TOKEN is not defined in environment variables');
    }

    hubspotClient = new Client({
      accessToken,
    });
  }

  return hubspotClient;
}

/**
 * Verify HubSpot connection
 */
export async function verifyHubSpotConnection(): Promise<boolean> {
  try {
    const client = getHubSpotClient();
    // Try to fetch account info to verify connection
    await client.apiRequest({
      method: 'GET',
      path: '/integrations/v1/me',
    });
    return true;
  } catch (error) {
    console.error('HubSpot connection verification failed:', error);
    return false;
  }
}

/**
 * Get HubSpot account details
 */
export async function getAccountInfo() {
  try {
    const client = getHubSpotClient();
    const response = await client.apiRequest({
      method: 'GET',
      path: '/integrations/v1/me',
    });
    return response;
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
}