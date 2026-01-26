import { getHubSpotClient } from '../lib/hubspot/client';

/**
 * Script to create all custom contact properties for Launchpad
 * Run: npx ts-node scripts/setup-contact-properties.ts
 */

const contactProperties = [
  // Founder Properties
  {
    name: 'onboarding_status',
    label: 'Onboarding Status',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Applied', value: 'applied' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'In Review', value: 'in_review' },
    ],
  },
  {
    name: 'payment_status',
    label: 'Payment Status',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Paid', value: 'paid' },
      { label: 'Waived', value: 'waived' },
      { label: 'Refunded', value: 'refunded' },
    ],
  },
  {
    name: 'cohort',
    label: 'Cohort',
    type: 'string',
    fieldType: 'text',
    groupName: 'contactinformation',
  },
  {
    name: 'next_step',
    label: 'Next Step',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'contactinformation',
  },

  // Mentor Properties
  {
    name: 'mentor_expertise',
    label: 'Mentor Expertise',
    type: 'string',
    fieldType: 'text',
    groupName: 'contactinformation',
  },
  {
    name: 'mentor_availability',
    label: 'Mentor Availability',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Available', value: 'available' },
      { label: 'Busy', value: 'busy' },
      { label: 'On Leave', value: 'on_leave' },
    ],
  },
  {
    name: 'mentor_sessions_completed',
    label: 'Sessions Completed',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
  },

  // Investor Properties
  {
    name: 'investor_focus',
    label: 'Investment Focus',
    type: 'string',
    fieldType: 'text',
    groupName: 'contactinformation',
  },
  {
    name: 'investor_stage',
    label: 'Investment Stage',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Seed', value: 'seed' },
      { label: 'Series A', value: 'series_a' },
      { label: 'Series B', value: 'series_b' },
      { label: 'Growth', value: 'growth' },
    ],
  },
  {
    name: 'investor_ticket_size',
    label: 'Ticket Size',
    type: 'string',
    fieldType: 'text',
    groupName: 'contactinformation',
  },

  // Sponsor Properties
  {
    name: 'sponsorship_level',
    label: 'Sponsorship Level',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Platinum', value: 'platinum' },
      { label: 'Gold', value: 'gold' },
      { label: 'Silver', value: 'silver' },
      { label: 'Bronze', value: 'bronze' },
    ],
  },
  {
    name: 'contribution_amount',
    label: 'Contribution Amount',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
  },
  {
    name: 'sponsorship_status',
    label: 'Sponsorship Status',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
      { label: 'Expired', value: 'expired' },
    ],
  },

  // Event Host Properties
  {
    name: 'event_host_organization_type',
    label: 'Organization Type',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'contactinformation',
    options: [
      { label: 'University', value: 'university' },
      { label: 'Co-working Space', value: 'coworking' },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    name: 'events_hosted',
    label: 'Events Hosted',
    type: 'number',
    fieldType: 'number',
    groupName: 'contactinformation',
  },
  {
    name: 'next_event',
    label: 'Next Event',
    type: 'date',
    fieldType: 'date',
    groupName: 'contactinformation',
  },
];

async function createContactProperties() {
  const client = getHubSpotClient();

  console.log('🚀 Creating custom contact properties...\n');

  for (const property of contactProperties) {
    try {
      const propertyData: any = {
        name: property.name,
        label: property.label,
        type: property.type,
        fieldType: property.fieldType,
        groupName: property.groupName,
      };

      // Add options for enumeration types
      if (property.options) {
        propertyData.options = property.options;
      }

      await client.crm.properties.coreApi.create('contacts', propertyData);

      console.log(`✅ Created property: ${property.label} (${property.name})`);
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log(`⚠️  Property "${property.label}" already exists - skipping`);
      } else {
        console.error(`❌ Failed to create "${property.label}":`, error.message);
      }
    }
  }

  console.log('\n✨ Contact properties setup complete!');
}

createContactProperties().catch(console.error);