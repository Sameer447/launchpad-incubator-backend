// HubSpot Type Definitions for Launchpad

export interface HubSpotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    // Custom properties for founders
    application_status?: 'Applied' | 'Accepted' | 'Rejected' | 'In Review';
    deposit_status?: 'Pending' | 'Paid' | 'Waived' | 'Refunded';
    onboarding_stage?: 'Not Started' | 'Profile Setup' | 'Agreement Signed' | 'Payment Complete' | 'Onboarded';
    current_cohort?: string;
    next_steps?: string;
    [key: string]: any;
  };
  associations?: ContactAssociation[];
}

export interface ContactAssociation {
  id: string;
  type: string;
  label?: string;
}

export interface FounderData extends HubSpotContact {
  role: 'founder';
  cohortInfo?: CohortInfo;
}

export interface CohortInfo {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status?: 'Active' | 'Upcoming' | 'Completed';
}

export interface AssociationLabel {
  category: string;
  typeId: number;
  label: string;
}

// Updated to match HubSpot API client types
export type FilterOperator = 'EQ' | 'NEQ' | 'LT' | 'LTE' | 'GT' | 'GTE' | 'BETWEEN' | 'IN' | 'NOT_IN' | 'HAS_PROPERTY' | 'NOT_HAS_PROPERTY' | 'CONTAINS_TOKEN' | 'NOT_CONTAINS_TOKEN';

export interface ContactFilter {
  propertyName: string;
  operator: FilterOperator;
  value?: string;
  values?: string[];
  highValue?: string;
}

export interface ContactSearchRequest {
  filterGroups?: {
    filters: ContactFilter[];
  }[];
  properties?: string[];
  limit?: number;
  after?: string;
  sorts?: string[];
}

export interface ContactSearchResponse {
  total: number;
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FounderCardData {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationStatus: string;
  depositStatus: string;
  onboardingStage: string;
  currentCohort: string;
  nextSteps: string;
}

// Status enums for type safety
export enum ApplicationStatus {
  APPLIED = 'Applied',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  IN_REVIEW = 'In Review',
}

export enum DepositStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  WAIVED = 'Waived',
  REFUNDED = 'Refunded',
}

export enum OnboardingStage {
  NOT_STARTED = 'Not Started',
  PROFILE_SETUP = 'Profile Setup',
  AGREEMENT_SIGNED = 'Agreement Signed',
  PAYMENT_COMPLETE = 'Payment Complete',
  ONBOARDED = 'Onboarded',
}