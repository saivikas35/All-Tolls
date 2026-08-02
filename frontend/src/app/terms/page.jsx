export const metadata = {
  title: "Terms of Service | AllTools",
  description: "Terms of Service for using AllTools.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AllTools ("we", "our", or "us"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                AllTools provides an online suite of file conversion, editing, and optimization tools. We are constantly improving our services, 
                and we may add, change, or remove features at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities and File Ownership</h2>
              <p>
                You retain all rights and ownership to the files you upload and process through AllTools. 
                You are solely responsible for the content of the files you upload. You agree not to upload any files that:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Violate any applicable local, state, national, or international law.</li>
                <li>Infringe upon the intellectual property rights of others.</li>
                <li>Contain malicious code, viruses, or any harmful software.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy and Data Security</h2>
              <p>
                We take your privacy seriously. Files uploaded to AllTools are processed automatically and are deleted from our servers shortly after processing is complete. 
                For more details, please review our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
              <p>
                The service is provided on an "as is" and "as available" basis. AllTools makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
              <p>
                In no event shall AllTools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on AllTools's website, even if AllTools has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modifications to Terms</h2>
              <p>
                AllTools may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us via our <a href="/feedback" className="text-indigo-600 hover:underline">Feedback form</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
