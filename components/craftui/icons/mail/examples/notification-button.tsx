'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IconMail } from '../notification';

export function NotificationButton() {
  const [hasNotification, setHasNotification] = useState(false);

  // ⚠️ DEMO ONLY: Simulating a new email notification after 2 seconds
  // In your real application, replace this with your actual notification logic:
  //
  // Example with WebSocket:
  // useEffect(() => {
  //   const ws = new WebSocket('wss://your-api.com/notifications');
  //   ws.onmessage = (event) => {
  //     if (event.data.type === 'new_email') {
  //       setHasNotification(true);
  //     }
  //   };
  // }, []);
  //
  // Example with polling:
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const unreadCount = await fetchUnreadEmails();
  //     setHasNotification(unreadCount > 0);
  //   }, 30000); // Check every 30 seconds
  //   return () => clearInterval(interval);
  // }, []);
  //
  // Example with real-time database (Firebase, Supabase):
  // useEffect(() => {
  //   const unsubscribe = supabase
  //     .channel('emails')
  //     .on('postgres_changes', { event: 'INSERT' }, () => {
  //       setHasNotification(true);
  //     })
  //     .subscribe();
  //   return () => unsubscribe();
  // }, []);
  //
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNotification(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Reset notification when user clicks (opens inbox)
  const handleOpenInbox = () => {
    setHasNotification(false);
    // In real app: navigate to inbox or mark as read
    // router.push('/inbox');
    // markAllAsRead();
  };

  return (
    <motion.button
      onClick={handleOpenInbox}
      className="
        relative inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-blue-50 text-blue-900 hover:bg-blue-100
        border border-blue-200
        transition-colors duration-200
      "
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <div className="relative flex items-center">
        <IconMail 
          size={20} 
          hasNotification={hasNotification}
          color="#3b82f6" // blue-500
        />
        
        {/* Glowing ping indicator - shows when there are notifications */}
        {hasNotification && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            {/* Animated ping */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            {/* Static dot */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </div>

      <span className="font-medium">
        Inbox
      </span>
    </motion.button>
  );
}