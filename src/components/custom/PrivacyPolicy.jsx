import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Introduction</h2>
            <p>
              At Viaona.com ("we," "our," or "us"), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, or any other related services (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By using our Service, you consent to the practices described in this policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
              <li><strong>Profile Information:</strong> You may choose to provide additional information such as a profile picture, location, and travel preferences.</li>
              <li><strong>Travel Information:</strong> Information about your travel plans, destinations, dates, and preferences.</li>
              <li><strong>Payment Information:</strong> If you make purchases through our Service, we collect payment details, billing address, and other financial information necessary to process your transaction.</li>
              <li><strong>Communications:</strong> Information you provide when you contact us for customer support or participate in surveys or promotions.</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <p>When you use our Service, we may automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Device Information:</strong> Information about your device, including IP address, device type, operating system, and browser type.</li>
              <li><strong>Usage Information:</strong> Information about how you use our Service, such as the pages you visit, the time and duration of your visits, and the actions you take.</li>
              <li><strong>Location Information:</strong> With your consent, we may collect precise location information from your device to provide location-based services.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect information about your browsing activity. Please refer to our Cookie Policy for more information.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. How We Use Your Information</h2>
            <p>We use your information for various purposes, including to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process and complete transactions</li>
              <li>Create and update your account</li>
              <li>Generate personalized travel recommendations and itineraries</li>
              <li>Communicate with you about your account, updates, and promotional offers</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze usage trends and preferences</li>
              <li>Detect, prevent, and address technical issues and fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. How We Share Your Information</h2>
            <p>We may share your information with the following categories of recipients:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> Third-party vendors and service providers who help us provide and improve our Service, such as hosting providers, payment processors, and analytics services.</li>
              <li><strong>Business Partners:</strong> Travel-related partners with whom we collaborate to offer you combined services or promotions.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process, to protect our rights, to protect your safety or the safety of others, to investigate fraud, or to enforce our Terms of Service.</li>
              <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
              <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. Data Retention and Security</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, no electronic transmission or storage of information can be guaranteed to be 100% secure.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Your Choices and Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> You may request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> You may request that we correct inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> You may request that we delete your personal information in certain circumstances.</li>
              <li><strong>Data Portability:</strong> You may request a copy of the information you have provided to us in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> You may object to our processing of your personal information in certain circumstances.</li>
              <li><strong>Withdrawal of Consent:</strong> You may withdraw your consent at any time where we rely on your consent to process your personal information.</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Information" section below.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as soon as possible.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">8. International Data Transfers</h2>
            <p>
              Your personal information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
            </p>
            <p>
              We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">9. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the changes becoming effective. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">10. Contact Information</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:teams@Viaona.com" className="text-blue-600 hover:text-blue-800">teams@Viaona.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 