import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response';
import { getHubSpotClient } from '@/lib/hubspot/client';
export async function POST(request: NextRequest) {
  try {
    const { contactIds, cohort } = await request.json();
    const client = getHubSpotClient();

    // Update all contacts with the cohort
    const promises = contactIds.map((id: string) =>
      client.crm.contacts.basicApi.update(id, {
        properties: { current_cohort: cohort },
      })
    );

    await Promise.all(promises);

    return successResponse(
      { updated: contactIds.length },
      'Cohort assigned successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}