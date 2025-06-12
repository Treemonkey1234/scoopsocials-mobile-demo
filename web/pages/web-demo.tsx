import React from 'react';
import Head from 'next/head';
import ScoopApp from '../src/components/ScoopApp';

export default function WebDemo() {
  return (
    <>
      <Head>
        <title>ScoopSocials - Web Demo</title>
        <meta name="description" content="ScoopSocials web demo with community reviews and commenting system" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#00BCD4" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ScoopApp />
        </div>
      </div>
    </>
  );
}