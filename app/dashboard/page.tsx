"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createApiKey, getDashboardData } from "./actions";
import {  ApiKeyStatus, Emails, User, Wallet } from "../generated/prisma/client";

interface ApiKey {
    id: string;
    userId: string;
    label: string;
    status: ApiKeyStatus;
    createdAt: Date;
    updatedAt: Date;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [stats, setStats] = useState<Emails[]>([]);
  const [KPI, setKPI] = useState<{ total: number; sent: number; failed: number } | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [newApiKeyValue, setNewApiKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);





  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getDashboardData();
        if (res) {
          setApiKeys(res.apiKeys);
          setStats(res.emails);
          setWallet(res.wallet);
          setKPI(res.totalEmailsSent);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } 
    }
    fetchData();
  }, []);




  const monthlyCount = useMemo(() => stats.length, [stats]);
  const sentCount = useMemo(() => stats.filter((s) => s.status === "sent").length, [stats]);
  const failedCount = useMemo(() => stats.filter((s) => s.status === "failed").length, [stats]);

  async function handleCreateKey() {
    if (!newKeyLabel.trim()) return;
    try {
      setLoading(true);
      const response = await createApiKey();
      if (response.error) {
        // Handle error (e.g., show notification)
        return;
      }
      if (!response.keyDetails || !response.apiKey) {
        return;
      }
      setApiKeys((prev) => [response.keyDetails, ...prev]);
      setNewKeyLabel("");
      setNewApiKeyValue(response.apiKey);
      setShowKeyDialog(true);
      setCopied(false);
    } finally {
      setLoading(false);
    }
  }

  function handleRevokeKey(id: string) {
    // Example: await fetch(`/api/v1/keys/${id}`, { method: "DELETE" })
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  }

  // Modal dialog for new API key
  const KeyDialog = () => (
    showKeyDialog && newApiKeyValue ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-2xl border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Your new API key</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">This key will only be shown once. Copy and save it securely.</p>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg select-all break-all">
              {newApiKeyValue}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newApiKeyValue);
                setCopied(true);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-medium transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => {
              setShowKeyDialog(false);
              setNewApiKeyValue(null);
            }}
            className="w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 py-2 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    ) : null
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <KeyDialog />
      <SignedOut>
        <section className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-700">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Please sign in to manage your API keys and view request stats.
          </p>
          <div className="mt-6">
            <SignInButton>
              <button className="rounded-full bg-foreground px-5 py-2.5 text-background">Sign In</button>
            </SignInButton>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <section className="mb-8">
          <h1 className="text-2xl font-bold">Hi {user?.firstName || user?.username || "there"} 👋</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Create and manage API keys, and track your email requests.
          </p>
        </section>

        {/* Overview cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Monthly usage</div>
            <div className="mt-2 text-3xl font-extrabold">{monthlyCount}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Sent</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600">{sentCount}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed</div>
            <div className="mt-2 text-3xl font-extrabold text-red-600">{failedCount}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Limit</div>
            <div className="mt-2 text-3xl font-extrabold">{wallet?.balanceCredits} Credits</div>
          </div>
        </section>

        {/* API Keys */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <div className="flex gap-2">
              <input
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                placeholder="Key label (e.g., Production)"
                className="h-10 min-w-60 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                onClick={handleCreateKey}
                disabled={loading}
                className="h-10 rounded-lg bg-linear-to-r from-sky-500 to-blue-600 px-4 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Key"}
              </button>
            </div>
          </div>

          {apiKeys.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              No keys yet. Create your first API key to start sending.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Label</th>
                    <th className="px-4 py-3">Key (preview)</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Last used</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-4 py-3">{k.label}</td>
                      <td className="px-4 py-3 font-mono text-xs">{k.label || "sk_********"}</td>
                      <td className="px-4 py-3">{new Date(k.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">{k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="rounded-md border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Requests */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          {stats.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              No requests yet. Your recent email requests will appear here.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">To</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-4 py-3">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">{s.to}</td>
                      <td className="px-4 py-3">{s.subject}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            s.status === "sent"
                              ? "rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
                              : s.status === "failed"
                              ? "rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                              : "rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{s.requestId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </SignedIn>
    </main>
  );
}
