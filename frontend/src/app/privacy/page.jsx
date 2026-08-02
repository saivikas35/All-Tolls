export const metadata = {
  title: "Privacy Policy | AllTools",
  description: "Privacy Policy for AllTools.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>
                At AllTools, we collect information to provide better services to all our users. The types of information we collect include:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Information you provide to us:</strong> When you sign up for an account, we ask for personal information, like your name and email address.</li>
                <li><strong>Files you process:</strong> To use our file conversion and editing tools, you must upload files to our servers.</li>
                <li><strong>Usage data:</strong> We collect anonymous data about how you interact with our services, such as which tools you use most frequently.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services. Specifically:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To process your files and deliver the requested output.</li>
                <li>To authenticate your account and keep our services secure.</li>
                <li>To communicate with you, including sending updates and security alerts.</li>
                <li>To analyze usage patterns and improve our user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. File Security and Retention</h2>
              <p>
                <strong>Your files are your property.</strong> We process them automatically. 
                Files uploaded to our servers are temporarily stored for the duration of the processing. 
                Once the processing is complete and you have downloaded the result, the original and processed files are automatically deleted from our servers. 
                We do not view, analyze, or share the contents of your files.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
              <p>
                We do not share your personal information with companies, organizations, or individuals outside of AllTools except in the following cases:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>With your consent:</strong> We will share personal information outside of AllTools when we have your consent.</li>
                <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p>
                We work hard to protect AllTools and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. 
                In particular, we encrypt our services using SSL and we review our information collection, storage, and processing practices to guard against unauthorized access to systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to This Privacy Policy</h2>
              <p>
                Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please contact us via our <a href="/feedback" className="text-indigo-600 hover:underline">Feedback form</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
