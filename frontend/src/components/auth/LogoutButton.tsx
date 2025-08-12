'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';
import React from 'react';

export interface LogoutButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export default function LogoutButton({
                                         label = 'Logout',
                                         ...props
                                     }: LogoutButtonProps) {
    const logout = useLogout();

    return (
        <Button
            variant="outline"
            onClick={logout}
            {...props}
        >
            <LogOut className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
