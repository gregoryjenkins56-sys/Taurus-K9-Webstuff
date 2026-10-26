export interface ContractSection {
  sectionId: string; heading: string; content: string; order: number;
  acknowledgmentType: 'none' | 'initials' | 'signature'; required: boolean;
}
export interface ContractTemplate {
  title: string; version: string; isPlaceholder: boolean;
  approval: { contract: boolean; electronicDisclosure: boolean };
  sections: ContractSection[];
  electronicDisclosure: { version: string; content: string };
  optionalConsents: { consentId: string; heading: string; content: string }[];
}
export interface Assignment {
  agreementId: string; clientId: string;
  client: { name: string; contactName?: string; phone?: string; city?: string };
  dog: { name: string; breed: string; birthDate?: string | null; approximateAge?: string };
  service: { name: string; enrollmentId?: string; programId?: string; priceMinor?: number; depositMinor?: number; currency?: string };
}
export interface AgreementSnapshot extends Assignment, Omit<ContractTemplate, 'sections'> {
  contentHash: string; sections: (ContractSection & { contentHash: string })[];
}
export interface Acknowledgment {
  agreementId: string; clientId: string; version: string; agreementHash: string;
  sectionId: string; sectionHash: string; type: 'initials' | 'signature';
  value: string; recordedAt: string; evidenceId?: string;
}
export interface Submission { printedName: string; signature: string; consent: boolean; intent: boolean }
export interface SigningEvent { id: string; action: string; sectionId: string | null; recordedAt: string }
export interface SigningState {
  acknowledgments: Record<string, Acknowledgment>;
  optionalConsents: Record<string, { accepted: boolean; recordedAt: string }>;
  drafts: Record<string, string>; printedName: string; signature: string;
  events: SigningEvent[]; completion: (Submission & { id: string; completedAt: string; disclosureVersion: string }) | null;
  revision: number; savedAt: string | null;
}
export function validateTemplate(template: unknown): ContractTemplate;
export function liveSigningAvailable(template: ContractTemplate): boolean;
export function contentHash(value: unknown): Promise<string>;
export function createAgreementSnapshot(template: ContractTemplate, assignment: Assignment): Promise<AgreementSnapshot>;
export function acknowledgmentMatches(snapshot: AgreementSnapshot, section: AgreementSnapshot['sections'][number], record?: Acknowledgment): boolean;
export function validSignatureValue(value: unknown, type?: string): value is string;
export function acknowledgmentProgress(snapshot: AgreementSnapshot, acknowledgments: Record<string, Acknowledgment>): { required: number; completed: number };
export function finalSigningErrors(snapshot: AgreementSnapshot, state: SigningState, submission: Submission, options?: { simulation?: boolean }): { field: string; message: string }[];