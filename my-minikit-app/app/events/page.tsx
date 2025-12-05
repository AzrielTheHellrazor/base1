"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useReadContract, useAccount } from "wagmi";
import { EVENT_STAKING_ADDRESS, EVENT_STAKING_ABI } from "@/lib/contracts";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const { address } = useAccount();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // For now, we'll show a placeholder. In production, you'd fetch events from a backend
  // or use events from the contract (though contracts don't have a listEvents function)

  useEffect(() => {
    // TODO: Implement event fetching logic
    // This could be done via:
    // 1. Indexing contract events
    // 2. Backend API that tracks events
    // 3. Subgraph
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-light text-white tracking-tight mb-2">Events</h1>
            <p className="text-gray-300 font-light">Browse and join upcoming events</p>
          </div>
          <Link
            href="/events/create"
            className="bg-white text-purple-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-lg"
          >
            Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-16 text-center border border-white/10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white text-xl mb-3 font-light">No events yet</p>
            <p className="text-gray-300 mb-8 font-light">
              Be the first to create an event and start building your community
            </p>
            <Link
              href="/events/create"
              className="inline-block bg-white text-purple-900 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-lg"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={Number(event.id)}
                href={`/events/${event.id}`}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-medium text-white tracking-tight">
                    Event #{Number(event.id)}
                  </h3>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-light">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{Number(event.depositAmount) / 1e6} USDC deposit</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-light">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{Number(event.participants.length)} participant{Number(event.participants.length) !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

