// @ts-nocheck
import { getHubSpotClient } from './client';
import { ContactAssociation, AssociationLabel } from './types';

/**
 * Get associations for a contact
 */
export async function getContactAssociations(
  contactId: string,
  toObjectType: string = 'companies'
): Promise<ContactAssociation[]> {
  try {
    const client = getHubSpotClient();
    const response = await client.crm.associations.batchApi.read(
      'contacts',
      toObjectType,
      {
        inputs: [{ id: contactId }],
      }
    );

    if (!response.results || response.results.length === 0) {
      return [];
    }

    const associations = response.results[0]?.to || [];
    return associations.map(assoc => ({
      id: assoc.toObjectId,
      type: toObjectType,
      label: assoc.associationTypes?.[0]?.label,
    }));
  } catch (error) {
    console.error(`Error fetching associations for contact ${contactId}:`, error);
    throw error;
  }
}

/**
 * Get contacts with specific association label
 * This is the key function for filtering by role
 */
export async function getContactsByAssociationLabel(
  labelName: string,
  companyId?: string
): Promise<string[]> {
  try {
    const client = getHubSpotClient();
    
    // First, get all association labels to find the matching one
    const labels = await client.crm.associations.schema.definitionsApi.getAll(
      'contacts',
      'companies'
    );

    const targetLabel = labels.results.find(
      label => label.label.toLowerCase() === labelName.toLowerCase()
    );

    if (!targetLabel) {
      throw new Error(`Association label "${labelName}" not found`);
    }

    // If companyId provided, get contacts associated with that company
    if (companyId) {
      const associations = await client.crm.companies.associationsApi.getAll(
        companyId,
        'contacts',
        undefined,
        undefined
      );

      // Filter by association type
      const filteredContacts = associations.results.filter(
        assoc => assoc.type === targetLabel.typeId.toString()
      );

      return filteredContacts.map(assoc => assoc.id);
    }

    // If no company specified, return empty array
    // In production, you'd implement broader search logic
    return [];
  } catch (error) {
    console.error(`Error fetching contacts by label "${labelName}":`, error);
    throw error;
  }
}

/**
 * Get all association labels for contact-company relationships
 */
export async function getContactCompanyAssociationLabels(): Promise<AssociationLabel[]> {
  try {
    const client = getHubSpotClient();
    const response = await client.crm.associations.schema.definitionsApi.getAll(
      'contacts',
      'companies'
    );

    return response.results.map((label: any) => ({
      category: label.category,
      typeId: label.typeId,
      label: label.label,
    }));
  } catch (error) {
    console.error('Error fetching association labels:', error);
    throw error;
  }
}

/**
 * Create association between contact and company with label
 */
export async function createContactCompanyAssociation(
  contactId: string,
  companyId: string,
  associationTypeId: number
): Promise<void> {
  try {
    const client = getHubSpotClient();
    await client.crm.associations.batchApi.create('contacts', 'companies', {
      inputs: [
        {
          from: { id: contactId },
          to: { id: companyId },
          types: [
            {
              associationCategory: 'USER_DEFINED',
              associationTypeId,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Error creating association:', error);
    throw error;
  }
}

/**
 * Get founder label ID from environment or fetch dynamically
 */
export async function getFounderAssociationLabelId(): Promise<number> {
  const envLabelId = process.env.ASSOCIATION_LABEL_FOUNDER;
  console.log('Founder association label ID from env:', envLabelId );
  if (envLabelId) {
    return parseInt(envLabelId, 10);
  }

  // Fetch dynamically
  const labels = await getContactCompanyAssociationLabels();
  const founderLabel = labels.find(
    label => label.label.toLowerCase() === 'founder'
  );

  if (!founderLabel) {
    throw new Error('Founder association label not found');
  }

  return founderLabel.typeId;
}