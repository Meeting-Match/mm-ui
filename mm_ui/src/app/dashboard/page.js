"use client";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignOutButton from "../components/SignOutButton";

export default function Dashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-4">Welcome, {user?.username || 'User'}!</p>
        <div className="space-y-4 mb-6">
          <Link href="/create-event" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Create Event
          </Link>
          <Link href="/events/created" className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            My Created Events
          </Link>
          <Link href="/events/participating" className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
            Events I'm Participating In
          </Link>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
