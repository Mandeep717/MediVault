/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: labreports
 * Interface for LabReports
 */
export interface LabReports {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientId?: string;
  /** @wixFieldType text */
  reportName?: string;
  /** @wixFieldType text */
  testType?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  reportFile?: string;
  /** @wixFieldType text */
  testResultSummary?: string;
  /** @wixFieldType date */
  reportDate?: Date | string;
  /** @wixFieldType text */
  labName?: string;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: patients
 * Interface for Patients
 */
export interface Patients {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientName?: string;
  /** @wixFieldType text */
  mobileNumber?: string;
  /** @wixFieldType date */
  dateOfBirth?: Date | string;
  /** @wixFieldType text */
  gender?: string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  medicalHistory?: string;
  /** @wixFieldType text */
  currentComplications?: string;
}


/**
 * Collection ID: prescriptions
 * Interface for Prescriptions
 */
export interface Prescriptions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientId?: string;
  /** @wixFieldType text */
  drugName?: string;
  /** @wixFieldType text */
  dosage?: string;
  /** @wixFieldType text */
  usageInstructions?: string;
  /** @wixFieldType datetime */
  prescriptionDate?: Date | string;
  /** @wixFieldType text */
  prescribingDoctorName?: string;
  /** @wixFieldType number */
  refillsAllowed?: number;
  /** @wixFieldType date */
  expirationDate?: Date | string;
}


/**
 * Collection ID: treatmentplans
 * Interface for TreatmentPlans
 */
export interface TreatmentPlans {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientId?: string;
  /** @wixFieldType text */
  planName?: string;
  /** @wixFieldType text */
  planType?: string;
  /** @wixFieldType text */
  planDetails?: string;
  /** @wixFieldType date */
  startDate?: Date | string;
  /** @wixFieldType date */
  expectedEndDate?: Date | string;
  /** @wixFieldType text */
  currentStatus?: string;
  /** @wixFieldType text */
  doctorNotes?: string;
}
