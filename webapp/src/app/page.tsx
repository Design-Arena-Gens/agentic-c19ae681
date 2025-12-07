import TestPlanner from "@/components/TestPlanner";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-50 px-6 py-16 text-zinc-900 sm:px-10">
      <main className="w-full max-w-5xl">
        <TestPlanner />
      </main>
    </div>
  );
}
