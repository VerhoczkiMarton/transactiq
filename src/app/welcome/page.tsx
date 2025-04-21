'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  LineChart,
  Lock,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WelcomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to allow for smooth animation entry
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="from-background to-background/10 relative min-h-screen overflow-hidden bg-gradient-to-b">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div
            className={`transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="mb-8 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Wallet className="h-6 w-6" />
              </div>
              <h1 className="ml-3 text-3xl font-bold">FinTrack</h1>
            </div>
            <div className="text-center">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Take Control of Your <span className="text-primary">Finances</span>
              </h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
                Track expenses, manage budgets, and achieve your financial goals with our
                comprehensive financial tracking solution.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={() => router.push('/auth/signin')}>
                  Sign In
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/')}>
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div
            className={`mt-24 grid gap-8 transition-all delay-300 duration-1000 md:grid-cols-3 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <FeatureCard
              icon={<CreditCard className="text-primary h-10 w-10" />}
              title="Transaction Tracking"
              description="Easily record and categorize all your financial transactions in one place."
            />
            <FeatureCard
              icon={<LineChart className="text-primary h-10 w-10" />}
              title="Insightful Analytics"
              description="Visualize your spending patterns and financial health with interactive charts."
            />
            <FeatureCard
              icon={<DollarSign className="text-primary h-10 w-10" />}
              title="Budget Management"
              description="Create and manage budgets to keep your spending in check and reach your goals."
            />
          </div>

          {/* Testimonials */}
          <div
            className={`mt-24 transition-all delay-500 duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <h3 className="mb-8 text-center text-2xl font-bold">Trusted by thousands of users</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="This app completely changed how I manage my finances. I've saved over $500 in the first month alone!"
                author="Sarah J."
              />
              <TestimonialCard
                quote="The analytics dashboard gives me insights I never had before. Now I know exactly where my money goes."
                author="Michael T."
              />
              <TestimonialCard
                quote="Setting up budgets and tracking expenses has never been easier. Highly recommend to everyone!"
                author="Emily R."
              />
            </div>
          </div>

          {/* CTA */}
          <div
            className={`bg-primary/10 mt-24 rounded-xl p-8 text-center transition-all delay-700 duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <h3 className="mb-4 text-2xl font-bold">Ready to take control of your finances?</h3>
            <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
              Join thousands of users who have transformed their financial lives with FinTrack.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => router.push('/auth/signin')}>
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/')}>
                Explore Demo
              </Button>
            </div>
          </div>

          {/* Footer */}
          <footer
            className={`mt-24 border-t pt-8 text-center transition-all delay-900 duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="flex items-center justify-center space-x-4">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm">
                Contact Us
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <Lock className="text-muted-foreground mr-2 h-4 w-4" />
              <span className="text-muted-foreground text-sm">Secure & encrypted</span>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              © 2023 FinTrack. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-background/50 overflow-hidden border-none shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card className="bg-background/50 overflow-hidden border-none shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="text-primary mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="text-muted-foreground mb-4 italic">&quot;{quote}&quot;</p>
        <p className="font-medium">{author}</p>
      </CardContent>
    </Card>
  );
}
