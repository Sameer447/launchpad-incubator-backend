import { NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot/client';

/**
 * GET /api/properties - List all contact properties
 * Useful for verifying custom properties exist
 */
export async function GET() {
  try {
    const client = getHubSpotClient();
    
    // Get all contact properties
    const properties = await client.crm.properties.coreApi.getAll('contacts');
    
    // Filter to show only custom properties we care about
    const customProps = properties.results.filter((prop: any) => 
      ['application_status', 'onboarding_status', 'payment_status', 'next_step', 'cohort'].includes(prop.name)
    );

    return NextResponse.json({
      success: true,
      total: properties.results.length,
      customProperties: customProps,
      allProperties: properties.results.map((p: any) => ({
        name: p.name,
        label: p.label,
        type: p.type,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch properties',
      },
      { status: 500 }
    );
  }
}
