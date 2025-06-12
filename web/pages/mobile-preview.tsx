import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function MobilePreview() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [accountType, setAccountType] = useState<'free' | 'professional' | null>(null);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return text;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
      <div className="flex-1 flex flex-col justify-between p-8">
        <div className="text-center mt-12">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl font-bold text-cyan-500">S</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">ScoopSocials</h1>
          <p className="text-cyan-100 text-lg">Building trust in digital connections</p>
        </div>

        <div className="space-y-4 text-center">
          <div className="bg-white/10 backdrop-blur rounded-full px-6 py-4 flex items-center">
            <span className="text-2xl mr-4">🛡️</span>
            <span className="text-lg">Verified Profiles</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-full px-6 py-4 flex items-center">
            <span className="text-2xl mr-4">📱</span>
            <span className="text-lg">Phone Verification</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-full px-6 py-4 flex items-center">
            <span className="text-2xl mr-4">👥</span>
            <span className="text-lg">Community Trust</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen('signup')}
            className="w-full bg-white text-cyan-500 py-4 rounded-full text-lg font-bold"
          >
            Create Account
          </button>
          <button
            onClick={() => setCurrentScreen('login')}
            className="w-full border-2 border-white text-white py-4 rounded-full text-lg font-semibold"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-xs text-cyan-100 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  const SignupScreen = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="mb-6 p-2 text-gray-600"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
        <p className="text-gray-600 mb-8">Join the community and start building trust</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">We'll send a verification code to this number</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-lg"
            />
          </div>

          <button
            onClick={() => setCurrentScreen('verification')}
            className="w-full bg-cyan-500 text-white py-4 rounded-xl text-lg font-bold mt-8"
          >
            Continue
          </button>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => setCurrentScreen('login')}
              className="text-cyan-500 font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="mb-6 p-2 text-gray-600"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Sign in to your ScoopSocials account</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-lg text-center"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              We'll send a verification code to confirm it's you
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('verification')}
            className="w-full bg-cyan-500 text-white py-4 rounded-xl text-lg font-bold"
          >
            Send Verification Code
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button className="w-full border border-cyan-500 text-cyan-500 py-4 rounded-xl text-lg font-semibold flex items-center justify-center">
            <span className="mr-2">👆</span>
            Use Touch ID
          </button>

          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={() => setCurrentScreen('signup')}
              className="text-cyan-500 font-semibold"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VerificationScreen = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <button
          onClick={() => setCurrentScreen(phoneNumber ? 'signup' : 'login')}
          className="mb-6 p-2 text-gray-600"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify Phone Number</h1>
        <p className="text-gray-600 text-center mb-8">
          We sent a 6-digit code to<br />
          <span className="font-semibold text-cyan-500">{phoneNumber || '(555) 123-4567'}</span>
        </p>

        <div className="flex justify-center space-x-3 mb-8">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={verificationCode[index] || ''}
              onChange={(e) => {
                const newCode = verificationCode.split('');
                newCode[index] = e.target.value;
                setVerificationCode(newCode.join(''));
                if (e.target.value && index < 5) {
                  const nextInput = document.querySelector(`input:nth-of-type(${index + 2})`) as HTMLInputElement;
                  nextInput?.focus();
                }
              }}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <button className="text-cyan-500 font-semibold">
            Resend Code
          </button>
        </div>

        <button
          onClick={() => setCurrentScreen('account-type')}
          className="w-full bg-cyan-500 text-white py-4 rounded-xl text-lg font-bold"
        >
          Verify
        </button>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            For testing, use code: <span className="font-bold text-cyan-500">123456</span>
          </p>
        </div>
      </div>
    </div>
  );

  const AccountTypeScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500">
      <div className="p-6">
        <button
          onClick={() => setCurrentScreen('verification')}
          className="mb-6 p-2 text-white"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-cyan-100 mb-8">Select the account type that best fits your needs</p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Free Account Card */}
        <div
          onClick={() => setAccountType('free')}
          className={`p-6 rounded-2xl cursor-pointer transition-all ${
            accountType === 'free'
              ? 'bg-white border-2 border-cyan-500'
              : 'bg-white/90 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Free Account</h3>
              <p className="text-gray-600">Perfect for getting started</p>
              <p className="text-lg font-bold text-gray-800 mt-2">$0/month</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 ${
              accountType === 'free' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
            }`}>
              {accountType === 'free' && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
            </div>
          </div>
          <div className="space-y-2">
            {[
              'Basic posting and reviewing',
              'Standard friend connections',
              'Event attendance',
              'Trust score display',
              'Community validation'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Account Card */}
        <div
          onClick={() => setAccountType('professional')}
          className={`p-6 rounded-2xl cursor-pointer transition-all relative ${
            accountType === 'professional'
              ? 'bg-white border-2 border-cyan-500'
              : 'bg-white/90 border-2 border-transparent'
          }`}
        >
          <div className="absolute -top-2 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            POPULAR
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Professional Account</h3>
              <p className="text-gray-600">For power users and organizers</p>
              <p className="text-lg font-bold text-gray-800 mt-2">$9.99/month</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 ${
              accountType === 'professional' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
            }`}>
              {accountType === 'professional' && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
            </div>
          </div>
          <div className="space-y-2">
            {[
              'Everything in Free',
              'Create Local Community Hubs',
              'Create Interest-Based Groups',
              'Enhanced event management',
              'Advanced community features',
              'Priority support',
              'Analytics dashboard'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={() => setCurrentScreen('contacts')}
          disabled={!accountType}
          className={`w-full py-4 rounded-xl text-lg font-bold ${
            accountType
              ? 'bg-white text-cyan-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with {accountType === 'free' ? 'Free' : 'Professional'} Account
        </button>
      </div>
    </div>
  );

  const ContactsScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500">
      <div className="p-6">
        <button
          onClick={() => setCurrentScreen('account-type')}
          className="mb-6 p-2 text-white"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Find Friends</h1>
        <p className="text-cyan-100 mb-8">
          Discover who's already on ScoopSocials and invite others to join
        </p>
      </div>

      <div className="flex-1 bg-white m-4 rounded-t-3xl p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect with Friends</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We'll check your contacts to see who's already on ScoopSocials and help you connect with them instantly.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">👥</span>
              <span className="text-gray-700">Find existing friends</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">📤</span>
              <span className="text-gray-700">Invite new friends</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">🔒</span>
              <span className="text-gray-700">Your privacy is protected</span>
            </div>
          </div>

          <button
            onClick={() => alert('Welcome to ScoopSocials! 🎉\n\nLogin flow completed successfully!\n\nNext: Install React Native to run the actual mobile app.')}
            className="w-full bg-cyan-500 text-white py-4 rounded-xl text-lg font-bold mb-4"
          >
            Import Contacts
          </button>

          <button
            onClick={() => alert('Welcome to ScoopSocials! 🎉\n\nLogin flow completed successfully!\n\nNext: Install React Native to run the actual mobile app.')}
            className="text-gray-500 underline"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen />;
      case 'signup': return <SignupScreen />;
      case 'login': return <LoginScreen />;
      case 'verification': return <VerificationScreen />;
      case 'account-type': return <AccountTypeScreen />;
      case 'contacts': return <ContactsScreen />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '700px' }}>
        {/* Status Bar */}
        <div className="bg-white px-4 py-2 flex justify-between items-center text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        
        {/* Screen Content */}
        <div className="h-full">
          {renderScreen()}
        </div>
      </div>
      
      <div className="ml-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📱 ScoopSocials Mobile Login</h1>
        <p className="text-gray-600 mb-6">
          This is a web preview of the mobile login flow. The actual mobile app requires React Native setup.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Test the Flow:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try both "Create Account" and "Sign In"</li>
            <li>• Use verification code: <strong>123456</strong></li>
            <li>• Select Free or Professional account</li>
            <li>• Complete the full flow</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">To Run Mobile App:</h3>
          <pre className="text-xs text-green-700 bg-green-100 p-2 rounded">
{`cd mobile
npm install
npx react-native start
npx react-native run-android`}
          </pre>
        </div>
      </div>
    </div>
  );
}