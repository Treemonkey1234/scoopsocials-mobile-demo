import React from 'react';
import Head from 'next/head';
import ScoopApp from '../src/components/ScoopApp';

export default function Home() {
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
        <div className="w-full max-w-md">
          <ScoopApp />
        </div>
      </div>
    </>
  );
}