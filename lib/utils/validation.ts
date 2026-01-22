import { z } from 'zod';

// Validation schemas using Zod

export const ContactIdSchema = z.string().min(1, 'Contact ID is required');

export const ContactSearchSchema = z.object({
  filterGroups: z.array(
    z.object({
      filters: z.array(
        z.object({
          propertyName: z.string(),
          operator: z.enum([
            'EQ',
            'NEQ',
            'LT',
            'LTE',
            'GT',
            'GTE',
            'BETWEEN',
            'IN',
            'NOT_IN',
            'HAS_PROPERTY',
            'NOT_HAS_PROPERTY',
            'CONTAINS_TOKEN',
            'NOT_CONTAINS_TOKEN',
          ]),
          value: z.string().optional(),
          values: z.array(z.string()).optional(),
          highValue: z.string().optional(),
        })
      ),
    })
  ).optional(),
  properties: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
  after: z.string().optional(),
  sorts: z.array(z.string()).optional(),
});

export const UpdateContactSchema = z.object({
  properties: z.record(z.string(), z.any()),
});

export const AssociationLabelSchema = z.string().min(1, 'Association label is required');

export const CompanyIdSchema = z.string().min(1, 'Company ID is required');

/**
 * Validate request body against schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // @ts-ignore
      const errors = JSON.parse(error);
      const errorMessage = errors.map((err: any) => err.message).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Validate HubSpot contact ID format
 */
export function isValidHubSpotId(id: string): boolean {
  return /^\d+$/.test(id);
}