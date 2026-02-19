'use client';

import { useState } from 'react';
import { IconLockShowPassword } from '../default';

export function ShowPasswordButton() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      {/* Password Input Field */}
      <div className="relative">
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2.5 pr-12 bg-stone-50 border-2 focus:ring-0 border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
        />
        
        {/* Toggle Button - Positioned inside input */}
        <button
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md cursor-pointer"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          <IconLockShowPassword 
            size={18} 
            isUnlocked={isPasswordVisible}
          />
        </button>
      </div>
    </div>
  );
}