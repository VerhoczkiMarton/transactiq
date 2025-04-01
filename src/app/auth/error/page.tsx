'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link has expired or has already been used.';
      case 'OAuthSignin':
        return 'Error in the OAuth sign-in process. Please try again.';
      case 'OAuthCallback':
        return 'Error in the OAuth callback process. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create an OAuth account. Please try another method.';
      case 'EmailCreateAccount':
        return 'Could not create an email account. Please try another method.';
      case 'Callback':
        return 'Error in the callback handler. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another provider. Please sign in using the original provider.';
      case 'EmailSignin':
        return 'Error sending the email. Please try again.';
      case 'CredentialsSignin':
        return 'The credentials you provided are invalid. Please try again.';
      case 'SessionRequired':
        return 'You must be signed in to access this page.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/15 text-destructive rounded-md p-4 text-sm">
            {getErrorMessage(error)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => router.push('/auth/signin')} variant="default">
            Try Again
          </Button>
          <Button onClick={() => router.push('/')} variant="outline">
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
