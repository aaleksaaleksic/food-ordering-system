'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useLogin, useMe } from '@/hooks/use-auth';
import { useCan } from '@/hooks/use-permissions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LoginForm, type LoginFormData } from '@/components/auth/login-form';
import { FoodOrderingHero } from '@/components/auth/food-ordering-hero';
import { dt } from '@/lib/design-tokens';

export default function LoginPage() {
    const router = useRouter();

    const { data: me, isLoading: isMeLoading } = useMe();
    const { mutate: doLogin, isPending } = useLogin();
    const { isLoaded } = useCan();

    useEffect(() => {
        if (me && isLoaded) {
            router.push('/users');
        }
    }, [me, isLoaded, router]);

    const handleSubmit = (values: LoginFormData) => {
        doLogin(values, {
            onSuccess: () => {
                // Automatic redirect through useEffect above
            }
        });
    };

    // Ako je korisnik već ulogovan, prikaži loading
    if (isMeLoading || (me && isLoaded)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className={`${dt.layouts.authPage} flex items-center justify-center p-4`}>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">

                {/* Food ordering hero content */}
                <FoodOrderingHero />

                {/*Login form */}
                <LoginForm
                    onSubmit={handleSubmit}
                    isPending={isPending}
                />

            </div>
        </div>
    );
}