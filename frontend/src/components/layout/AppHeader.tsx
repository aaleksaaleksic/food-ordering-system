'use client';

import Link from 'next/link';
import { useMe } from '@/hooks/use-auth';
import LogoutButton from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AppHeader() {
    const { data: me } = useMe();

    return (
        <header className="w-full border-b bg-background">
            <div className="mx-auto max-w-6xl p-4 flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/users">
                        <Button variant="ghost" className="px-2">Users</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {me && (
                        <>
              <span className="text-sm text-muted-foreground">
                Logged in as <b>{me.firstName}  {[me.email]}</b>
              </span>
                            <Separator orientation="vertical" className="h-6" />
                        </>
                    )}
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
