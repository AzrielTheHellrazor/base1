"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { EVENT_STAKING_ADDRESS, EVENT_STAKING_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";
import { Event, ParticipantInfo } from "@/lib/types";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = BigInt(params.id as string);
  const { address, isConnected } = useAccount();
  const action = searchParams.get("action");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Read event data
  const { data: eventData, refetch: refetchEvent } = useReadContract({
    address: EVENT_STAKING_ADDRESS && EVENT_STAKING_ADDRESS.length > 0 ? (EVENT_STAKING_ADDRESS as `0x${string}`) : undefined,
    abi: EVENT_STAKING_ABI,
    functionName: "getEvent",
    args: EVENT_STAKING_ADDRESS && EVENT_STAKING_ADDRESS.length > 0 ? [eventId] : undefined,
  });

  // Read participant info
  const { data: participantInfo, refetch: refetchParticipant } = useReadContract({
    address: EVENT_STAKING_ADDRESS && EVENT_STAKING_ADDRESS.length > 0 ? (EVENT_STAKING_ADDRESS as `0x${string}`) : undefined,
    abi: EVENT_STAKING_ABI,
    functionName: "getParticipantInfo",
    args: address && EVENT_STAKING_ADDRESS && EVENT_STAKING_ADDRESS.length > 0 ? [eventId, address] : undefined,
  });

  // Read USDC balance and allowance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS && USDC_ADDRESS.length > 0 ? (USDC_ADDRESS as `0x${string}`) : undefined,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address && USDC_ADDRESS && USDC_ADDRESS.length > 0 ? [address] : undefined,
  });

  const { data: usdcAllowance } = useReadContract({
    address: USDC_ADDRESS && USDC_ADDRESS.length > 0 ? (USDC_ADDRESS as `0x${string}`) : undefined,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address && USDC_ADDRESS && USDC_ADDRESS.length > 0 && EVENT_STAKING_ADDRESS && EVENT_STAKING_ADDRESS.length > 0 ? [address, EVENT_STAKING_ADDRESS as `0x${string}`] : undefined,
  });

  // Join event
  const {
    data: joinHash,
    writeContract: joinEvent,
    isPending: isJoining,
  } = useWriteContract();

  const { isLoading: isJoinConfirming } = useWaitForTransactionReceipt({
    hash: joinHash,
    onSuccess: () => {
      setSuccess("Successfully joined event!");
      refetchEvent();
      refetchParticipant();
    },
  });

  // Approve USDC
  const {
    data: approveHash,
    writeContract: approveUSDC,
    isPending: isApproving,
  } = useWriteContract();

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
    onSuccess: () => {
      setSuccess("USDC approved! You can now join the event.");
    },
  });

  // Check in
  const {
    data: checkInHash,
    writeContract: checkIn,
    isPending: isCheckingIn,
  } = useWriteContract();

  const { isLoading: isCheckInConfirming } = useWaitForTransactionReceipt({
    hash: checkInHash,
    onSuccess: () => {
      setSuccess("Successfully checked in!");
      refetchEvent();
      refetchParticipant();
    },
  });

  const handleJoin = async () => {
    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (!eventData) {
      setError("Event data not loaded");
      return;
    }

    const depositAmount = eventData.depositAmount as bigint;
    const balance = usdcBalance as bigint;
    const allowance = usdcAllowance as bigint;

    if (balance < depositAmount) {
      setError(`Insufficient USDC balance. Need ${formatUnits(depositAmount, 6)} USDC`);
      return;
    }

    if (!USDC_ADDRESS || USDC_ADDRESS.length === 0 || !EVENT_STAKING_ADDRESS || EVENT_STAKING_ADDRESS.length === 0) {
      setError("Contract addresses not configured");
      return;
    }

    if (allowance < depositAmount) {
      // Approve first
      approveUSDC({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: "approve",
        args: [EVENT_STAKING_ADDRESS as `0x${string}`, depositAmount],
      });
      return;
    }

    // Join event
    joinEvent({
      address: EVENT_STAKING_ADDRESS as `0x${string}`,
      abi: EVENT_STAKING_ABI,
      functionName: "joinEvent",
      args: [eventId],
    });
  };

  const handleCheckIn = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    if (!EVENT_STAKING_ADDRESS || EVENT_STAKING_ADDRESS.length === 0) {
      setError("Contract address not configured");
      return;
    }

    checkIn({
      address: EVENT_STAKING_ADDRESS as `0x${string}`,
      abi: EVENT_STAKING_ABI,
      functionName: "checkIn",
      args: [eventId, address],
    });
  };

  useEffect(() => {
    if (action === "join" && isConnected && eventData) {
      handleJoin();
    } else if (action === "checkin" && isConnected && address) {
      handleCheckIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, isConnected]);

  if (!EVENT_STAKING_ADDRESS || EVENT_STAKING_ADDRESS.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 max-w-md">
          <p className="text-yellow-200 text-center">
            Contract addresses not configured. Please set NEXT_PUBLIC_EVENT_STAKING_ADDRESS in your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading event...</p>
      </div>
    );
  }

  const event = eventData as unknown as Event;
  const participant = participantInfo as unknown as ParticipantInfo | undefined;
  const depositAmount = formatUnits(event.depositAmount as bigint, 6);
  const needsApproval = usdcAllowance && event.depositAmount && (usdcAllowance as bigint) < (event.depositAmount as bigint);
  const canJoin = !participant?.joined && !event.settled && BigInt(Math.floor(Date.now() / 1000)) < (event.startTime as bigint);
  const canCheckIn = participant?.joined && !participant.checkedIn && BigInt(Math.floor(Date.now() / 1000)) >= (event.startTime as bigint);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/events"
          className="text-white/60 hover:text-white mb-8 inline-flex items-center gap-2 font-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-10 mb-8 border border-white/10">
          <h1 className="text-5xl font-light text-white mb-8 tracking-tight">
            Event #{Number(event.id)}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Organizer</div>
                <div className="text-white font-light">{event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Deposit Amount</div>
                <div className="text-white font-medium text-lg">{depositAmount} USDC</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Start Time</div>
                <div className="text-white font-light">{new Date(Number(event.startTime) * 1000).toLocaleString()}</div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Participants</div>
                <div className="text-white font-medium text-lg">{Number(event.participants.length)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Checked In</div>
                <div className="text-white font-medium text-lg">{Number(event.checkedInCount)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Total Deposits</div>
                <div className="text-white font-medium text-lg">{formatUnits(event.totalDeposits as bigint, 6)} USDC</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-1 uppercase tracking-wider">Status</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  event.settled 
                    ? "bg-gray-500/20 text-gray-300" 
                    : "bg-green-500/20 text-green-300"
                }`}>
                  {event.settled ? "Settled" : "Active"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {participant && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-light text-white mb-6 tracking-tight">Your Status</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-400 text-xs font-light mb-2 uppercase tracking-wider">Joined</div>
                <div className={`text-sm font-medium ${participant.joined ? "text-green-400" : "text-gray-500"}`}>
                  {participant.joined ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-2 uppercase tracking-wider">Checked In</div>
                <div className={`text-sm font-medium ${participant.checkedIn ? "text-green-400" : "text-gray-500"}`}>
                  {participant.checkedIn ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-light mb-2 uppercase tracking-wider">Payout Claimed</div>
                <div className={`text-sm font-medium ${participant.payoutClaimed ? "text-green-400" : "text-gray-500"}`}>
                  {participant.payoutClaimed ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-red-200 font-light">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-green-200 font-light">{success}</p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-4">
            {canJoin && (
              <button
                onClick={handleJoin}
                disabled={isJoining || isJoinConfirming || isApproving || isApproveConfirming}
                className="w-full bg-white text-purple-900 px-6 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {needsApproval
                  ? isApproving || isApproveConfirming
                    ? "Approving USDC..."
                    : "Approve USDC First"
                  : isJoining || isJoinConfirming
                  ? "Joining..."
                  : `Join Event (${depositAmount} USDC)`}
              </button>
            )}

            {canCheckIn && (
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn || isCheckInConfirming}
                className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isCheckingIn || isCheckInConfirming
                  ? "Checking In..."
                  : "Check In"}
              </button>
            )}
          </div>
        )}

        {!isConnected && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <p className="text-white/80 font-light text-center">
              Please connect your wallet to interact with this event
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

