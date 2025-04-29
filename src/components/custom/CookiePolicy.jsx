import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Cookie Policy.
        </h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Introduction</h2>
            <p>
              This Cookie Policy explains how Viaona.com ("we," "our," or "us") uses cookies and similar technologies on our website, mobile application, and other related services (collectively, the "Service"). This Cookie Policy should be read together with our Privacy Policy.
            </p>
            <p>
              By using our Service, you consent to the use of cookies and similar technologies in accordance with this Cookie Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent" or "session" cookies.
            </p>
            <p>
              Persistent cookies remain on your device for a set period of time or until you delete them, while session cookies are deleted when you close your browser.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. Types of Cookies and Similar Technologies We Use</h2>
            <p>We use various types of cookies and similar technologies:</p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the Service to function properly. They enable basic functions like page navigation, access to secure areas, and security features. The Service cannot function properly without these cookies.
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.2 Preference Cookies</h3>
            <p>
              These cookies allow us to remember your preferences and customize your experience. For example, they may remember your language preferences, your login details, or your region.
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.3 Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. They help us improve our Service by providing insights into usage patterns and helping us identify and fix issues.
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.4 Marketing Cookies</h3>
            <p>
              These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.5 Similar Technologies</h3>
            <p>
              In addition to cookies, we may use other similar technologies, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Web Beacons:</strong> Small graphic images that allow us to monitor the use of our Service.</li>
              <li><strong>Pixels:</strong> Small images that allow us to track when you have performed specific actions, such as clicking on a link.</li>
              <li><strong>Local Storage:</strong> Data stored in your browser's local storage that helps us provide features like saving your preferences.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. Specific Cookies We Use</h2>
            <p>Here are some examples of the cookies we use:</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-4 text-sm">auth_token</td>
                    <td className="py-2 px-4 text-sm">Essential</td>
                    <td className="py-2 px-4 text-sm">Keeps you logged in</td>
                    <td className="py-2 px-4 text-sm">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">_ga</td>
                    <td className="py-2 px-4 text-sm">Analytics</td>
                    <td className="py-2 px-4 text-sm">Used by Google Analytics to distinguish users</td>
                    <td className="py-2 px-4 text-sm">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">_fbp</td>
                    <td className="py-2 px-4 text-sm">Marketing</td>
                    <td className="py-2 px-4 text-sm">Used by Facebook to deliver advertisements</td>
                    <td className="py-2 px-4 text-sm">3 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">pref_lang</td>
                    <td className="py-2 px-4 text-sm">Preference</td>
                    <td className="py-2 px-4 text-sm">Remembers your language preference</td>
                    <td className="py-2 px-4 text-sm">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third parties on our behalf. Third parties may use cookies, web beacons, and similar technologies to collect or receive information from our Service and elsewhere on the internet and use that information to provide measurement services and target ads.
            </p>
            <p>
              These third parties may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Analytics providers</strong> (such as Google Analytics)</li>
              <li><strong>Advertising networks</strong> (such as Google Ads, Facebook)</li>
              <li><strong>Social media platforms</strong> (such as Facebook, Twitter, LinkedIn)</li>
              <li><strong>Service providers</strong> (such as chat support, email marketing)</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Managing Cookies</h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, delete cookies, or alert you when cookies are being sent. However, if you disable or refuse cookies, please note that some parts of our Service may become inaccessible or not function properly.
            </p>
            <p>
              Here are links to instructions on how to manage cookies in popular browsers:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Microsoft Edge</a></li>
            </ul>
            <p>
              For mobile devices, you can manage how your device and browser share certain device data by adjusting the privacy and security settings on your mobile device.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Do Not Track</h2>
            <p>
              Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your online activity tracked. Due to the lack of a common interpretation of these signals, our Service currently does not respond to browser "Do Not Track" signals.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">8. Changes to this Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the changes becoming effective. We encourage you to review this Cookie Policy periodically.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">9. Contact Information</h2>
            <p>
              If you have any questions or concerns about this Cookie Policy, please contact us at <a href="mailto:privacy@Viaona.com" className="text-blue-600 hover:text-blue-800">privacy@Viaona.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 
