import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-xs sm:text-sm uppercase tracking-[0.14em] text-blue-700 font-semibold">
          Legal
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          This Privacy Policy explains how YourInterviewCoach collects, uses,
          and protects your information when you use our platform.
        </p>

        <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We may collect account details, booking details, payment metadata,
              and communication records required to provide mentorship services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. How We Use Information
            </h2>
            <p className="mt-2">
              We use your data to manage sessions, improve platform quality,
              provide support, process payments, and communicate important
              updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. Data Security
            </h2>
            <p className="mt-2">
              We apply reasonable administrative and technical safeguards to
              protect your personal information from unauthorized access,
              alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Third-Party Services
            </h2>
            <p className="mt-2">
              Certain features may rely on trusted third-party providers such as
              payment processors or analytics tools. Their handling of data is
              governed by their own policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Contact</h2>
            <p className="mt-2">
              For privacy-related questions, contact us at{" "}
              <a
                className="text-blue-700 hover:text-blue-800"
                href="mailto:hello@yourinterviewcoach.com"
              >
                hello@yourinterviewcoach.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex items-center gap-6 text-sm">
          <Link
            href="/terms"
            className="text-blue-700 hover:text-blue-800 font-medium"
          >
            View Terms & Conditions
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
