'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './actions'

export default function OnboardingComponent() {
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    if (res?.message) {
      await user?.reload()
      router.push('/')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const formData = new FormData(event.currentTarget)
      await handleSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl shadow-slate-900/60 backdrop-blur-xl p-8 sm:p-10 text-slate-50">
        <div className="mb-8 space-y-3 text-center">
          <p className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            Welcome
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Tell us about your workspace
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
            We’ll personalize your email experience based on how and where
            you’ll be using it.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-slate-100"
            >
              Organization or project name
            </label>
            <input
              id="orgName"
              name="organizationName"
              type="text"
              required
              placeholder="e.g. Acme Inc, Personal Projects"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-0"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-100">
                What will you be using it for?
              </p>
              <p className="text-xs text-slate-400">
                Choose the primary purpose that best describes your use case.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900">
                <input
                  type="radio"
                  name="purpose"
                  value="Transactional emails"
                  required
                  className="mt-1 h-4 w-4 border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>
                  <span className="font-medium block">Transactional emails</span>
                  <span className="text-xs text-slate-400">
                    Order confirmations, password resets, receipts, and more.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900">
                <input
                  type="radio"
                  name="purpose"
                  value="Marketing campaigns"
                  className="mt-1 h-4 w-4 border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>
                  <span className="font-medium block">Marketing campaigns</span>
                  <span className="text-xs text-slate-400">
                    Newsletters, product announcements, onboarding sequences.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900">
                <input
                  type="radio"
                  name="purpose"
                  value="Internal notifications"
                  className="mt-1 h-4 w-4 border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>
                  <span className="font-medium block">Internal notifications</span>
                  <span className="text-xs text-slate-400">
                    Alerts and updates for your team or company.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900">
                <input
                  type="radio"
                  name="purpose"
                  value="Other"
                  className="mt-1 h-4 w-4 border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>
                  <span className="font-medium block">Something else</span>
                  <span className="text-xs text-slate-400">
                    A different use case or you’re still exploring.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-slate-500">
              You can change these settings anytime from your dashboard.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
           >
              {isSubmitting ? 'Continuing…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}