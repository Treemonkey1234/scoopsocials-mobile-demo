import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [accountType, setAccountType] = useState<'free' | 'professional' | 'venue' | null>(null);
  const [previousScreen, setPreviousScreen] = useState('welcome');

  useEffect(() => {
    console.log('=== STATE CHANGE ===');
    console.log('currentScreen changed to:', currentScreen);
    console.log('previousScreen:', previousScreen);
    console.log('accountType:', accountType);
    console.log('phoneNumber:', phoneNumber);
    console.log('==================');
  }, [currentScreen, previousScreen, accountType, phoneNumber]);

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
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white overflow-hidden">
      <div className="flex-1 flex flex-col p-5 py-3">
        <div className="text-center mt-3">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-lg font-bold text-cyan-500">S</span>
          </div>
          <h1 className="text-xl font-bold mb-1">ScoopSocials</h1>
          <p className="text-cyan-100 text-sm">Building trust in digital connections</p>
        </div>

        <div className="space-y-3 text-center my-4 flex-1 flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur rounded-full px-4 py-3 flex items-center">
            <span className="text-xl mr-3">🛡️</span>
            <span className="text-base">Verified Profiles</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-full px-4 py-3 flex items-center">
            <span className="text-xl mr-3">📱</span>
            <span className="text-base">Phone Verification</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-full px-4 py-3 flex items-center">
            <span className="text-xl mr-3">👥</span>
            <span className="text-base">Community Trust</span>
          </div>
        </div>

        <div className="space-y-3 pb-1">
          <button
            onClick={() => {
              setPreviousScreen('welcome');
              setCurrentScreen('signup');
            }}
            className="w-full bg-white text-cyan-500 py-3 rounded-full text-base font-bold"
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setPreviousScreen('welcome');
              setCurrentScreen('login');
            }}
            className="w-full border-2 border-white text-white py-3 rounded-full text-base font-semibold"
          >
            Sign In
          </button>
          <p className="text-center text-xs text-cyan-100 px-2 leading-tight">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );

  const SignupScreen = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="mb-4 p-2 text-gray-600"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
        <p className="text-gray-600 mb-4">Join the community and start building trust</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">We'll send a verification code to this number</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-base"
            />
          </div>

          <button
            onClick={() => {
              setPreviousScreen('signup');
              setCurrentScreen('verification');
            }}
            className="w-full bg-cyan-500 text-white py-3 rounded-xl text-lg font-bold mt-6"
          >
            Continue
          </button>

          <div className="text-center mt-4 pb-4">
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
            onClick={() => {
              setPreviousScreen('login');
              setCurrentScreen('verification');
            }}
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
          onClick={() => setCurrentScreen(previousScreen)}
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
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <button
          onClick={() => setCurrentScreen('verification')}
          className="mb-4 p-2 text-white"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">Choose Your Plan</h1>
        <p className="text-cyan-100 text-sm">Select the account type that best fits your needs</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 max-h-[calc(100vh-200px)]">
        {/* Free Account Card */}
        <div
          onClick={() => setAccountType('free')}
          className={`p-4 rounded-2xl cursor-pointer transition-all ${
            accountType === 'free'
              ? 'bg-white border-2 border-cyan-500'
              : 'bg-white/90 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Free Account</h3>
              <p className="text-gray-600 text-sm">Perfect for getting started</p>
              <p className="text-lg font-bold text-gray-800 mt-1">$0/month</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              accountType === 'free' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
            }`}>
              {accountType === 'free' && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
            </div>
          </div>
          <div className="space-y-1">
            {[
              'Basic posting and reviewing',
              'Standard friend connections',
              'Event attendance',
              'Trust score display',
              'Community validation'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2 text-sm">✓</span>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Account Card */}
        <div
          onClick={() => setAccountType('professional')}
          className={`p-4 rounded-2xl cursor-pointer transition-all relative ${
            accountType === 'professional'
              ? 'bg-white border-2 border-cyan-500'
              : 'bg-white/90 border-2 border-transparent'
          }`}
        >
          <div className="absolute -top-2 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            POPULAR
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Professional Account</h3>
              <p className="text-gray-600 text-sm">For power users and organizers</p>
              <p className="text-lg font-bold text-gray-800 mt-1">$9.99/month</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              accountType === 'professional' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
            }`}>
              {accountType === 'professional' && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
            </div>
          </div>
          <div className="space-y-1">
            {[
              'Everything in Free',
              'Create Local Community Hubs',
              'Create Interest-Based Groups',
              'Enhanced event management',
              'Advanced community features',
              'Priority support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2 text-sm">✓</span>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Account Card */}
        <div
          onClick={() => setAccountType('venue')}
          className={`p-4 rounded-2xl cursor-pointer transition-all relative ${
            accountType === 'venue'
              ? 'bg-white border-2 border-cyan-500'
              : 'bg-white/90 border-2 border-transparent'
          }`}
        >
          <div className="absolute -top-2 right-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            PREMIUM
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Venue Account</h3>
              <p className="text-gray-600 text-sm">For bars, restaurants, and venues</p>
              <p className="text-lg font-bold text-gray-800 mt-1">$19.99/month</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              accountType === 'venue' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
            }`}>
              {accountType === 'venue' && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
            </div>
          </div>
          <div className="space-y-1">
            {[
              'Everything in Professional',
              'Customer outreach tools',
              'Event promotion features',
              'Business analytics',
              'Review management',
              'Customer engagement suite',
              'Dedicated venue profile'
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2 text-sm">✓</span>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur p-3 rounded-xl mb-6">
          <div className="flex items-center">
            <span className="text-white mr-2">ℹ️</span>
            <span className="text-white text-xs">
              You can upgrade or downgrade your plan anytime in settings
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 flex-shrink-0">
        <button
          onClick={() => setCurrentScreen('contacts')}
          disabled={!accountType}
          className={`w-full py-3 rounded-xl text-sm font-bold ${
            accountType
              ? 'bg-white text-cyan-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with {accountType === 'free' ? 'Free' : accountType === 'professional' ? 'Professional' : 'Venue'} Account
        </button>
      </div>
    </div>
  );

  const ContactsScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <button
          onClick={() => setCurrentScreen('account-type')}
          className="mb-4 p-2 text-white"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">Find Friends</h1>
        <p className="text-cyan-100 text-sm">
          Discover who's already on ScoopSocials and invite others to join
        </p>
      </div>

      <div className="flex-1 bg-white mx-3 mb-3 rounded-t-3xl overflow-hidden flex flex-col">
        <div className="flex-1 p-4 text-center overflow-y-auto">
          <div className="text-5xl mb-3">📱</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Connect with Friends</h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm">
            We'll check your contacts to see who's already on ScoopSocials and help you connect with them instantly.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">👥</span>
              <span className="text-gray-700 text-sm">Find existing friends</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">📤</span>
              <span className="text-gray-700 text-sm">Invite new friends</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-3">🔒</span>
              <span className="text-gray-700 text-sm">Your privacy is protected</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-shrink-0 space-y-3">
          <button
            onClick={() => {
              console.log('=== IMPORT CONTACTS BUTTON CLICKED ===');
              console.log('Current screen before change:', currentScreen);
              console.log('About to set screen to main-app');
              setCurrentScreen('main-app');
              console.log('setCurrentScreen called with main-app');
              console.log('=====================================');
            }}
            className="w-full bg-cyan-500 text-white py-3 rounded-xl text-base font-bold"
          >
            Import Contacts
          </button>

          <button
            onClick={() => {
              console.log('=== SKIP FOR NOW BUTTON CLICKED ===');
              console.log('Current screen before change:', currentScreen);
              console.log('About to set screen to main-app');
              setCurrentScreen('main-app');
              console.log('setCurrentScreen called with main-app');
              console.log('==================================');
            }}
            className="w-full text-gray-500 underline text-sm py-2"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );

  const MainAppScreen = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 flex-shrink-0 text-center border-b border-gray-200">
        <div className="text-4xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ScoopSocials!</h1>
        <p className="text-gray-600 text-sm">Your account has been successfully created</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="text-cyan-500 mr-2">✅</span>
              Account Setup Complete
            </h3>
            <p className="text-gray-600 text-sm">
              Your {accountType === 'free' ? 'Free' : accountType === 'professional' ? 'Professional' : 'Venue'} account is ready to use
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="text-green-500 mr-2">📱</span>
              Phone Verified
            </h3>
            <p className="text-gray-600 text-sm">
              {phoneNumber || '(555) 123-4567'} has been verified
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="text-purple-500 mr-2">🌟</span>
              What's Next?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">→</span>
                Start building your trust score by creating reviews
              </div>
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">→</span>
                Connect with friends and join community groups
              </div>
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">→</span>
                Explore local events and meetups
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 pt-4">
            <button
              onClick={() => {
                window.open('https://treemonkey1234.github.io/scoopsocials-mobile-demo/web-demo/', '_blank');
              }}
              className="w-full bg-cyan-500 text-white py-3 rounded-xl text-base font-bold"
            >
              Explore Community Feed
            </button>
            
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="w-full text-gray-500 underline text-sm py-2"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    console.log('=== RENDER SCREEN FUNCTION CALLED ===');
    console.log('Current screen state:', currentScreen);
    console.log('Type of currentScreen:', typeof currentScreen);
    console.log('currentScreen === "main-app":', currentScreen === 'main-app');
    
    switch (currentScreen) {
      case 'welcome': 
        console.log('RENDERING: WelcomeScreen');
        return <WelcomeScreen />;
      case 'signup': 
        console.log('RENDERING: SignupScreen');
        return <SignupScreen />;
      case 'login': 
        console.log('RENDERING: LoginScreen');
        return <LoginScreen />;
      case 'verification': 
        console.log('RENDERING: VerificationScreen');
        return <VerificationScreen />;
      case 'account-type': 
        console.log('RENDERING: AccountTypeScreen');
        return <AccountTypeScreen />;
      case 'contacts': 
        console.log('RENDERING: ContactsScreen');
        return <ContactsScreen />;
      case 'main-app': 
        console.log('RENDERING: MainAppScreen - SUCCESS!');
        console.log('MainAppScreen component exists:', typeof MainAppScreen);
        return <MainAppScreen />;
      default: 
        console.log('RENDERING: Default case - WelcomeScreen');
        console.log('Unhandled screen:', currentScreen);
        return <WelcomeScreen />;
    }
  };

  return (
    <>
      <Head>
        <title>ScoopSocials - Mobile Demo</title>
        <meta name="description" content="ScoopSocials - Building trust in digital connections through community-driven social verification" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#00BCD4" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://treemonkey1234.github.io/scoopsocials-mobile-demo/" />
        <meta property="og:title" content="ScoopSocials - Mobile Demo" />
        <meta property="og:description" content="Building trust in digital connections through community-driven social verification" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://treemonkey1234.github.io/scoopsocials-mobile-demo/" />
        <meta property="twitter:title" content="ScoopSocials - Mobile Demo" />
        <meta property="twitter:description" content="Building trust in digital connections through community-driven social verification" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] max-h-[90vh] flex flex-col">
          {/* Status Bar */}
          <div className="bg-white px-4 py-2 flex justify-between items-center text-xs font-semibold flex-shrink-0">
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
          
          {/* Debug Bar - Remove after fixing */}
          <div className="bg-red-100 px-2 py-1 text-xs text-red-800 border-b border-red-200">
            DEBUG: currentScreen = "{currentScreen}" | type = {typeof currentScreen}
          </div>
          
          {/* Screen Content */}
          <div className="flex-1 overflow-hidden">
            {renderScreen()}
          </div>
        </div>
        
        <div className="ml-8 max-w-md hidden lg:block">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📱 ScoopSocials Mobile</h1>
          <p className="text-gray-600 mb-6">
            Experience the complete mobile login and onboarding flow. This responsive demo works on all devices.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Test the Flow:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Try both "Create Account" and "Sign In"</li>
              <li>• Use verification code: <strong>123456</strong></li>
              <li>• Select Free, Professional, or Venue account</li>
              <li>• Complete the full onboarding flow</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Features Implemented:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• ✅ Phone verification system</li>
              <li>• ✅ Three-tier account structure</li>
              <li>• ✅ Contact import flow</li>
              <li>• ✅ Mobile-first responsive design</li>
              <li>• ✅ Complete authentication flow</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}