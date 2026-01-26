/**
 * Script to create all custom contact properties for Launchpad stakeholders
 * Run: npx tsx scripts/create-all-stakeholder-properties.ts
 */

import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

async function createAllStakeholderProperties() {
  const properties = [
    // Mentor properties
    {
      name: 'mentor_expertise',
      label: 'Mentor Expertise',
      type: 'string',
      fieldType: 'textarea',
      groupName: 'contactinformation',
      description: 'Areas of expertise for mentoring',
    },
    {
      name: 'mentor_availability',
      label: 'Mentor Availability',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'contactinformation',
      description: 'Mentor availability status',
      options: [
        { label: 'Available', value: 'available', displayOrder: 0, hidden: false },
        { label: 'Limited', value: 'limited', displayOrder: 1, hidden: false },
        { label: 'Unavailable', value: 'unavailable', displayOrder: 2, hidden: false },
      ],
    },
    {
      name: 'mentor_sessions_completed',
      label: 'Mentor Sessions Completed',
      type: 'number',
      fieldType: 'number',
      groupName: 'contactinformation',
      description: 'Number of mentoring sessions completed',
    },
    
    // Investor properties
    {
      name: 'investor_focus',
      label: 'Investment Focus',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      description: 'Investment focus areas (e.g., SaaS, FinTech)',
    },
    {
      name: 'investor_stage',
      label: 'Investment Stage',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'contactinformation',
      description: 'Preferred investment stage',
      options: [
        { label: 'Seed', value: 'seed', displayOrder: 0, hidden: false },
        { label: 'Series A', value: 'series_a', displayOrder: 1, hidden: false },
        { label: 'Series B', value: 'series_b', displayOrder: 2, hidden: false },
        { label: 'Growth', value: 'growth', displayOrder: 3, hidden: false },
      ],
    },
    {
      name: 'investor_ticket_size',
      label: 'Investment Ticket Size',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      description: 'Typical investment amount range',
    },
    
    // Sponsor properties
    {
      name: 'sponsorship_level',
      label: 'Sponsorship Level',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'contactinformation',
      description: 'Sponsorship tier level',
      options: [
        { label: 'Platinum', value: 'platinum', displayOrder: 0, hidden: false },
        { label: 'Gold', value: 'gold', displayOrder: 1, hidden: false },
        { label: 'Silver', value: 'silver', displayOrder: 2, hidden: false },
        { label: 'Bronze', value: 'bronze', displayOrder: 3, hidden: false },
      ],
    },
    {
      name: 'contribution_amount',
      label: 'Contribution Amount',
      type: 'number',
      fieldType: 'number',
      groupName: 'contactinformation',
      description: 'Sponsorship contribution amount',
    },
    {
      name: 'sponsorship_status',
      label: 'Sponsorship Status',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'contactinformation',
      description: 'Current sponsorship status',
      options: [
        { label: 'Active', value: 'active', displayOrder: 0, hidden: false },
        { label: 'Pending', value: 'pending', displayOrder: 1, hidden: false },
        { label: 'Expired', value: 'expired', displayOrder: 2, hidden: false },
        { label: 'Cancelled', value: 'cancelled', displayOrder: 3, hidden: false },
      ],
    },
    
    // Event Host properties
    {
      name: 'event_host_organization_type',
      label: 'Organization Type',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'contactinformation',
      description: 'Type of host organization',
      options: [
        { label: 'University', value: 'university', displayOrder: 0, hidden: false },
        { label: 'Co-working Space', value: 'co_working_space', displayOrder: 1, hidden: false },
        { label: 'Corporation', value: 'corporation', displayOrder: 2, hidden: false },
      ],
    },
    {
      name: 'events_hosted',
      label: 'Events Hosted',
      type: 'number',
      fieldType: 'number',
      groupName: 'contactinformation',
      description: 'Number of events hosted',
    },
    {
      name: 'next_event',
      label: 'Next Event',
      type: 'date',
      fieldType: 'date',
      groupName: 'contactinformation',
      description: 'Next scheduled event date',
    },
  ];

  console.log(`Creating ${properties.length} custom properties for stakeholders...\n`);

  for (const property of properties) {
    try {
      console.log(`Creating property: ${property.name}...`);
      await hubspotClient.crm.properties.coreApi.create('contacts', property as any);
      console.log(`✓ Created: ${property.label}`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⚠ Property ${property.name} already exists`);
      } else {
        console.error(`✗ Error creating ${property.name}:`, error.message);
      }
    }
  }

  console.log('\n✓ All properties processed!');
  console.log('\nNext steps:');
  console.log('1. Verify properties in HubSpot: Settings → Data Management → Properties');
  console.log('2. Create association labels for: Mentor, Investor, Sponsor, Event Host');
  console.log('3. Associate contacts with companies using appropriate labels');
}

createAllStakeholderProperties().catch(console.error);
