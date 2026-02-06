import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Folyo',
  description: 'Terms of Service for Folyo CV Builder',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: December 30, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Folyo (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600">
                Folyo is a CV and portfolio builder platform that allows users to create, customize, and share professional CVs and portfolios. The Service includes web-based tools for building and exporting documents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features of the Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Content</h2>
              <p className="text-gray-600">
                You retain ownership of the content you create using our Service. By using Folyo, you grant us a limited license to store and display your content solely for the purpose of providing the Service to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Upload false or misleading information</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Distribute malware or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600">
                The Service is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on our website. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at support@folyo.ai-whisperers.org
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>

    </div>
  )
}
