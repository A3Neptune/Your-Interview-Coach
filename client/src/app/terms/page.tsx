import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-xs sm:text-sm uppercase tracking-[0.14em] text-blue-700 font-semibold">
          Legal
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          These Terms & Conditions govern your use of YourInterviewCoach
          services. By using the platform, you agree to these terms.
        </p>

        <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Service Use
            </h2>
            <p className="mt-2">
              You agree to use the platform lawfully and provide accurate
              information during registration, booking, and communication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Bookings and Payments
            </h2>
            <p className="mt-2">
              Session pricing, payment processing, and cancellation/refund
              handling are subject to platform rules shown during checkout and
              booking confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. User Conduct
            </h2>
            <p className="mt-2">
              Harassment, abuse, fraud, and misuse of platform features are
              prohibited and may result in account suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Intellectual Property
            </h2>
            <p className="mt-2">
              Platform content, branding, and materials remain the property of
              YourInterviewCoach or its licensors, unless explicitly stated
              otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Contact</h2>
            <p className="mt-2">
              For legal queries, email{" "}
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
            href="/privacy"
            className="text-blue-700 hover:text-blue-800 font-medium"
          >
            View Privacy Policy
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
