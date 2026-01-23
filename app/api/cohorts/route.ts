import { NextRequest } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot/client';
import { successResponse, handleApiError } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const client = getHubSpotClient();
    
    // Get all companies (each represents a cohort)
    const companies = await client.crm.companies.basicApi.getPage(
      100,
      undefined,
      ['name', 'cohort_start_date', 'cohort_end_date', 'cohort_status']
    );

    const cohorts = companies.results.map(company => ({
      id: company.id,
      name: company.properties.name,
      startDate: company.properties.cohort_start_date,
      endDate: company.properties.cohort_end_date,
      status: company.properties.cohort_status || 'Active',
    }));

    return successResponse({ cohorts }, 'Cohorts retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}