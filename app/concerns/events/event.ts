import type { Submission } from './submission';

export type Event = {
  id: string;
  name: string;
  slug: string;
  submissions: Submission[];
};

export type RelayCursor = {
  id: number;
  eventId: number;
  currentSubmissionId: number;
  raidedAt?: string;
  createdAt: string;
  updatedAt: string;
};
