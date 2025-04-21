import Link from 'next/link';
import { Shield, ArrowLeft, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <Shield className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access this page. Please sign in or contact your
            administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-muted-foreground text-center">
          <p>
            This page requires authentication or specific permissions that your current account does
            not have.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
