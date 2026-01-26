import { getHubSpotClient } from '../lib/hubspot/client';

/**
 * Script to create all association labels for Launchpad
 * Run: npx ts-node scripts/setup-association-labels.ts
 */

const associationLabels = [
  { name: 'Founder', label: 'Founder' },
  { name: 'Mentor', label: 'Mentor' },
  { name: 'Investor', label: 'Investor' },
  { name: 'Sponsor', label: 'Sponsor' },
  { name: 'Event Host', label: 'Event Host' },
];

async function createAssociationLabels() {
  const client = getHubSpotClient();

  console.log('🚀 Creating association labels...\n');

  for (const labelConfig of associationLabels) {
    try {
      // Create association label between contacts and companies
      const response = await client.crm.associations.v4.schema.definitionsApi.create(
        'contacts',
        'companies',
        {
          label: labelConfig.label,
          name: labelConfig.name,
        }
      );

      console.log(`✅ Created "${labelConfig.label}" - Type ID: ${response}`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⚠️  "${labelConfig.label}" already exists - skipping`);
      } else {
        console.error(`❌ Failed to create "${labelConfig.label}":`, error.message);
      }
    }
  }

  console.log('\n✨ Association labels setup complete!');
}

createAssociationLabels().catch(console.error);