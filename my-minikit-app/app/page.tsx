"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useQuickAuth } from "@coinbase/onchainkit/minikit";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady, context } = useMiniKit();
  const { data: authData, isLoading: authLoading } = useQuickAuth<{
    userFid: string;
  }>("/api/auth");

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  const user = context?.user;
  const fid = user?.fid || authData?.userFid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="flex justify-end p-6">
        <Wallet />
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-light text-white mb-6 tracking-tighter">
            noFlake
          </h1>
          <p className="text-2xl md:text-3xl font-light text-gray-200 mb-6 tracking-tight">
            No flakes, just stakes
          </p>
          <p className="text-lg text-gray-300 mb-4 max-w-2xl mx-auto font-light leading-relaxed">
            Commit with crypto. Show up and get rewarded.
          </p>
          <p className="text-sm text-gray-400 mb-12 max-w-xl mx-auto font-light">
            Participants stake USDC to commit. No-shows forfeit their deposit. 
            Attendees split the pot. Simple, transparent, effective.
          </p>
          
          {fid && (
            <div className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3 mb-12 border border-white/10">
              <p className="text-white/90 font-light text-sm">
                Welcome back, FID: {fid}
                {user?.username && ` (@${user.username})`}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              href="/events/create"
              className="bg-white text-purple-900 px-8 py-3.5 rounded-xl font-medium text-base hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Create Event
            </Link>
            <Link
              href="/events"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-medium text-base hover:bg-white/20 transition-all border border-white/20"
            >
              Browse Events
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-white/10 rounded-xl mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-3 text-lg tracking-tight">Create Event</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Organize your meetup and set a deposit amount. Higher stakes attract more committed participants.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-white/10 rounded-xl mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-3 text-lg tracking-tight">Join & Stake</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Participants stake USDC to commit. The deposit is locked until the event concludes.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-white/10 rounded-xl mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-3 text-lg tracking-tight">Check In & Settle</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Attendees check in at the event. The organizer settles and distributes deposits to those who showed up.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-light text-white mb-4 tracking-tight">How It Works</h2>
            <div className="space-y-6 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-light text-sm">1</div>
                <div>
                  <h4 className="text-white font-medium mb-1">Event Creation</h4>
                  <p className="text-gray-300 text-sm font-light">Organizers create events with a required deposit amount in USDC.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-light text-sm">2</div>
                <div>
                  <h4 className="text-white font-medium mb-1">Participation</h4>
                  <p className="text-gray-300 text-sm font-light">Participants stake USDC to join. Deposits are held in escrow until settlement.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-light text-sm">3</div>
                <div>
                  <h4 className="text-white font-medium mb-1">Check-In & Settlement</h4>
                  <p className="text-gray-300 text-sm font-light">Attendees check in at the event time. The organizer settles and distributes deposits to checked-in participants.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
