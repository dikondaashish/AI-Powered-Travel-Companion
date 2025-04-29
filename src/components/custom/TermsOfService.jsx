import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Terms of Service
        </h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Introduction</h2>
            <p>
              Welcome to Viaona.com ("we," "our," or "us"). By accessing or using our website, mobile application, or any other related services (collectively, the "Service"), you agree to be bound by these Terms of Service.
            </p>
            <p>
              Please read these Terms carefully. If you do not agree with these Terms, you should not access or use our Service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. Description of Service</h2>
            <p>
               Viaona.com is an AI-powered travel planning platform that helps users create personalized travel itineraries. Our Service allows you to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create customized travel plans based on your preferences</li>
              <li>Explore destinations and attractions</li>
              <li>Manage and organize your trips</li>
              <li>Access interactive maps and travel information</li>
              <li>Share your travel plans with others</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. User Accounts</h2>
            <p>
              To access certain features of our Service, you may need to create an account. When you create an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. User Content</h2>
            <p>
              Our Service may allow you to submit, upload, or share content, including travel preferences, reviews, comments, and photos ("User Content"). By submitting User Content, you:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with providing our Service</li>
              <li>Represent and warrant that you own or have the necessary rights to the User Content</li>
              <li>Agree not to submit content that is illegal, offensive, harmful, or infringes on the rights of others</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. AI-Generated Content</h2>
            <p>
              Much of our Service relies on AI-generated content, including travel recommendations and itineraries. While we strive to provide accurate and useful information, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-generated content may not always be accurate, complete, or up-to-date</li>
              <li>You should independently verify important information before making travel decisions</li>
              <li>We are not responsible for any inaccuracies in AI-generated content</li>
              <li>Travel plans should be confirmed with actual establishments and service providers</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your access to or use of our Service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the changes becoming effective. Your continued use of the Service after such notification constitutes your acceptance of the modified Terms.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:team@Viaona.com" className="text-blue-600 hover:text-blue-800">team@viaona.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 