// components/UserSync.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/lib/store';
import { useEffect } from 'react';

export function UserSync() {
    const { isSignedIn, user, isLoaded } = useUser();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn && user) {
                setUser({
                    id: user.id,
                    name: user.firstName ?? undefined,
                    email: user.primaryEmailAddress?.emailAddress,
                    avatar: user.imageUrl,
                    worksStatus: 'web developer',
                });
            } else {
                setUser(null);
            }
        }
    }, [isSignedIn, user, isLoaded, setUser]);

    return null; // This component doesn't render anything
}