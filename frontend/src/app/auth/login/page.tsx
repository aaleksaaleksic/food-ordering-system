'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoginForm, { LoginFormData } from '@/components/auth/login-form';
import { useLogin, useMe, useLogout } from '@/hooks/use-auth';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AuthGuard from "@/components/auth/AuthGuard";
import AppHeader from "@/components/layout/AppHeader";

export default function LoginPage() {
    const router = useRouter();


    const { data: me } = useMe();
    const { mutate: doLogin, isPending, isSuccess } = useLogin();
    const logout = useLogout();


    useEffect(() => {
        if (isSuccess) {
            router.push('/users');
        }
    }, [isSuccess, router]);

    const handleSubmit = (vals: LoginFormData) => {

        doLogin(vals);
    };

    return (
        <AuthGuard allow = "guest" redirectToIfUnauthed="/users">
            <AppHeader/>
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">

            <div className="absolute top-4 right-4 flex items-center gap-3">
                {me && (
                    <>
            <span className="text-sm text-muted-foreground">
              Logged in as <b>{me.email}</b>
            </span>
                        <Separator orientation="vertical" className="h-6" />
                        <Button variant="secondary" onClick={() => router.push('/users')}>
                            Go to users
                        </Button>
                        <Button variant="outline" onClick={logout}>
                            Logout
                        </Button>
                    </>
                )}
            </div>

            <Card className="w-[360px] shadow-md">
                <CardHeader className="space-y-2">
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Welcome back! Sign in to continue.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <LoginForm enabled={!isPending} onSubmitAction={handleSubmit} />
                </CardContent>
            </Card>
        </div>
        </AuthGuard>
    );
}
