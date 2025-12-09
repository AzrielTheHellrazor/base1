// Contract ABIs and addresses
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "";
export const EVENT_STAKING_ADDRESS = process.env.NEXT_PUBLIC_EVENT_STAKING_ADDRESS || "";

// Minimal ABI for EventStaking contract
export const EVENT_STAKING_ABI = [
  "function createEvent(uint256 depositAmount, uint256 startTime) external returns (uint256)",
  "function joinEvent(uint256 eventId) external",
  "function checkIn(uint256 eventId, address participant) external",
  "function settleEvent(uint256 eventId) external",
  "function getEvent(uint256 eventId) external view returns (tuple(uint256 id, address organizer, uint256 depositAmount, uint256 startTime, bool settled, address[] participants, uint256 totalDeposits, uint256 checkedInCount))",
  "function getParticipantInfo(uint256 eventId, address participant) external view returns (tuple(bool joined, bool checkedIn, bool payoutClaimed))",
  "function getEventParticipants(uint256 eventId) external view returns (address[])",
  "event EventCreated(uint256 indexed eventId, address indexed organizer, uint256 depositAmount, uint256 startTime)",
  "event ParticipantJoined(uint256 indexed eventId, address indexed participant, uint256 depositAmount)",
  "event ParticipantCheckedIn(uint256 indexed eventId, address indexed participant)",
] as const;

// Minimal ABI for USDC (ERC20)
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
] as const;



