"use client";

import { useMemo, useState } from "react";

type TestStatus = "pending" | "running" | "passed" | "failed";

type TestItem = {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  updatedAt: Date;
};

const STATUS_ORDER: Record<TestStatus, number> = {
  running: 0,
  failed: 1,
  pending: 2,
  passed: 3,
};

const STATUS_LABELS: Record<TestStatus, string> = {
  running: "Running",
  failed: "Failed",
  pending: "Pending",
  passed: "Passed",
};

const STATUS_COLORS: Record<TestStatus, string> = {
  running: "bg-amber-100 text-amber-700 border-amber-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  pending: "bg-indigo-100 text-indigo-700 border-indigo-200",
  passed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function TestPlanner() {
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [tests, setTests] = useState<TestItem[]>([]);

  const sortedTests = useMemo(
    () =>
      [...tests].sort((a, b) => {
        const priority = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (priority !== 0) return priority;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }),
    [tests],
  );

  const summary = useMemo(
    () =>
      tests.reduce(
        (acc, test) => {
          acc.total += 1;
          acc[test.status] += 1;
          return acc;
        },
        {
          total: 0,
          running: 0,
          failed: 0,
          pending: 0,
          passed: 0,
        } as Record<TestStatus | "total", number>,
      ),
    [tests],
  );

  function addTest() {
    if (!testName.trim()) return;

    const newTest: TestItem = {
      id: generateId(),
      name: testName.trim(),
      description: testDescription.trim(),
      status: "pending",
      updatedAt: new Date(),
    };

    setTests((current) => [newTest, ...current]);
    setTestName("");
    setTestDescription("");
  }

  function updateStatus(id: string, status: TestStatus) {
    setTests((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date() } : item,
      ),
    );
  }

  function removeTest(id: string) {
    setTests((current) => current.filter((item) => item.id !== id));
  }

  const actionButtons: { id: TestStatus; label: string }[] = [
    { id: "running", label: "Running" },
    { id: "passed", label: "Passed" },
    { id: "failed", label: "Failed" },
    { id: "pending", label: "Pending" },
  ];

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.4em] text-indigo-600">
          Rapid QA Toolkit
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Build, plan, and track tests in seconds.
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 md:text-xl">
          Capture test ideas, document acceptance criteria, and monitor progress
          with a lightweight dashboard designed for rapid product experiments.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">New test</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-zinc-700">
                Test name
              </label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Smoke test: user can create account"
                value={testName}
                onChange={(event) => setTestName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-zinc-700">
                Acceptance criteria
              </label>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Document the validation steps a tester should follow…"
                value={testDescription}
                onChange={(event) => setTestDescription(event.target.value)}
              />
            </div>
            <button
              onClick={addTest}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
              disabled={!testName.trim()}
            >
              Add test
            </button>
          </div>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-inner">
          <h2 className="text-lg font-semibold text-zinc-900">Summary</h2>
          <div className="grid gap-4 text-sm">
            <SummaryRow label="Total" value={summary.total} />
            <SummaryRow label="Running" value={summary.running} tone="indigo" />
            <SummaryRow label="Passed" value={summary.passed} tone="emerald" />
            <SummaryRow label="Failed" value={summary.failed} tone="rose" />
            <SummaryRow label="Pending" value={summary.pending} tone="slate" />
          </div>
          <p className="text-sm text-zinc-500">
            Use test cards to progress scenarios from idea to confidence without
            leaving the browser.
          </p>
        </aside>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Active test bench
        </h2>
        {sortedTests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {sortedTests.map((test) => (
              <article
                key={test.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {test.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Updated {test.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_COLORS[test.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {STATUS_LABELS[test.status]}
                  </span>
                </div>
                {test.description ? (
                  <p className="text-sm leading-6 text-zinc-600">
                    {test.description}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  {actionButtons.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => updateStatus(test.id, action.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        test.status === action.id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      Mark {action.label}
                    </button>
                  ))}
                  <button
                    onClick={() => removeTest(test.id)}
                    className="ml-auto inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
  tone?: "indigo" | "emerald" | "rose" | "slate";
};

function SummaryRow({ label, value, tone = "slate" }: SummaryRowProps) {
  const toneStyles: Record<typeof tone, string> = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-zinc-100 text-zinc-700",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2">
      <span className="text-sm font-medium text-zinc-600">{label}</span>
      <span
        className={`inline-flex min-w-[44px] items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold ${toneStyles[tone]}`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-12 text-center text-indigo-700">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold">
        ✦
      </div>
      <h3 className="text-lg font-semibold">No tests yet</h3>
      <p className="max-w-sm text-sm text-indigo-600">
        Add your first scenario to start building out a lightweight regression
        suite and get a pulse on quality in under a minute.
      </p>
    </div>
  );
}
