export interface Event {
  id: bigint;
  organizer: string;
  depositAmount: bigint;
  startTime: bigint;
  settled: boolean;
  participants: string[];
  totalDeposits: bigint;
  checkedInCount: bigint;
}

export interface ParticipantInfo {
  joined: boolean;
  checkedIn: boolean;
  payoutClaimed: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  datetime: string;
  depositAmount: string;
}

