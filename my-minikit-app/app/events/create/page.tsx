"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { EVENT_STAKING_ADDRESS, EVENT_STAKING_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts";
import { useReadContract } from "wagmi";

export default function CreateEventPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    datetime: "",
    depositAmount: "5",
  });
  const [error, setError] = useState("");

  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS && USDC_ADDRESS.length > 0 ? (USDC_ADDRESS as `0x${string}`) : undefined,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address && USDC_ADDRESS && USDC_ADDRESS.length > 0 ? [address] : undefined,
  });

  // Create event transaction
  const {
    data: hash,
    writeContract,
    isPending: isCreating,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    const depositAmount = parseFloat(formData.depositAmount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Invalid deposit amount");
      return;
    }

    const startTime = Math.floor(new Date(formData.datetime).getTime() / 1000);
    if (startTime <= Math.floor(Date.now() / 1000)) {
      setError("Event time must be in the future");
      return;
    }

    if (!EVENT_STAKING_ADDRESS || EVENT_STAKING_ADDRESS.length === 0) {
      setError("Contract address not configured. Please set NEXT_PUBLIC_EVENT_STAKING_ADDRESS in your .env.local file.");
      return;
    }

    try {
      // Convert deposit amount to USDC units (6 decimals)
      const depositAmountWei = parseUnits(formData.depositAmount, 6);

      writeContract({
        address: EVENT_STAKING_ADDRESS as `0x${string}`,
        abi: EVENT_STAKING_ABI,
        functionName: "createEvent",
        args: [depositAmountWei, BigInt(startTime)],
      });
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    }
  };

  if (isSuccess) {
    router.push("/events");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-10">
          <h1 className="text-5xl font-light text-white mb-3 tracking-tight">Create Event</h1>
          <p className="text-gray-300 font-light">Organize a meetup and set deposit requirements</p>
        </div>

        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-8">
            <p className="text-yellow-200 font-light">
              Please connect your wallet to create an event
            </p>
          </div>
        )}

        {usdcBalance !== undefined && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-light text-sm">Your USDC Balance</span>
              <span className="text-white font-medium">{formatUnits(usdcBalance as bigint, 6)} USDC</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-3 text-sm tracking-tight">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all font-light"
              placeholder="e.g., Soccer Match"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3 text-sm tracking-tight">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all font-light resize-none"
              rows={5}
              placeholder="Describe your event, location details, and what participants can expect..."
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3 text-sm tracking-tight">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all font-light"
              placeholder="e.g., Central Park, NYC"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3 text-sm tracking-tight">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all font-light"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3 text-sm tracking-tight">
              Deposit Amount (USDC)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.depositAmount}
              onChange={(e) =>
                setFormData({ ...formData, depositAmount: e.target.value })
              }
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all font-light"
              placeholder="5.00"
              required
            />
            <p className="text-gray-400 text-xs mt-2 font-light">Amount participants must stake to join</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
              <p className="text-red-200 font-light">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isCreating || isConfirming || !isConnected}
              className="flex-1 bg-white text-purple-900 px-6 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isCreating || isConfirming
                ? "Creating..."
                : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 rounded-xl font-medium bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

