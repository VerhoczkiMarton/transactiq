'use client';

import { useEffect, useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useTheme } from 'next-themes';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState<{
    github: boolean;
    google: boolean;
  }>({
    github: false,
    google: false,
  });
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'This email is already associated with another provider. Please sign in using the original provider.'
      : searchParams.get('error')
  );

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));
      setError(null);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Choose your preferred sign in method</CardDescription>
          {error && (
            <div className="bg-destructive/15 text-destructive mt-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading.github || isLoading.google}
            aria-label="Sign in with GitHub"
          >
            {isLoading.github ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src={theme === 'dark' ? '/icons/github_white.svg' : '/icons/github_black.svg'}
                alt="GitHub Logo"
                width={16}
                height={16}
              />
            )}
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading.github || isLoading.google}
            aria-label="Sign in with Google"
          >
            {isLoading.google ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src={theme === 'dark' ? '/icons/google_white.svg' : '/icons/google_black.svg'}
                alt="Google Logo"
                width={16}
                height={16}
              />
            )}
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/auth/email-signin')}
            disabled={isLoading.github || isLoading.google}
            aria-label="Sign in with email"
          >
            <Image
              src={theme === 'dark' ? '/icons/email_white.svg' : '/icons/email_black.svg'}
              alt="Email Logo"
              width={16}
              height={16}
            />
            Sign in with Email
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-muted-foreground text-center text-sm">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<Fallback />}>
      <SignInContent />
    </Suspense>
  );
}
