'use client';
import Link from 'next/link';
import { ChevronDown, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signIn, signOut, useSession } from 'next-auth/react';
import { SVGProps } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <ApplicationLogo className="h-8 w-8" />
            <span className="font-semibold">TransactIQ</span>
          </Link>
          <nav className="hidden md:flex md:gap-6" aria-label="Main Navigation">
            <Link
              href="/transactions"
              className="hover:text-primary text-sm font-medium transition-colors"
              aria-label="View Transactions"
            >
              Transactions
            </Link>
            <Link
              href="/analytics"
              className="hover:text-primary text-sm font-medium transition-colors"
              aria-label="View Analytics"
            >
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user.image || ''}
                      alt={session?.user.name || 'User avatar'}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">{session?.user.name}</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  onKeyDown={e => e.key === 'Enter' && signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()} aria-label="Sign in to your account">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function ApplicationLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <g fill="none">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M11.5 3a4.5 4.5 0 0 1 4.336 3.292l.052.205l1.87-.467a1 1 0 0 1 1.233.84L19 7v1.81a6.5 6.5 0 0 1 1.364 1.882l.138.308H21a1 1 0 0 1 .993.883L22 12v3a1 1 0 0 1-.445.832l-.108.062l-1.168.585a6.5 6.5 0 0 1-2.02 2.325l-.259.174V20a1 1 0 0 1-.883.993L17 21h-3a1 1 0 0 1-.993-.883L13 20h-1a1 1 0 0 1-.883.993L11 21H8a1 1 0 0 1-.993-.883L7 20v-1.022a6.5 6.5 0 0 1-2.854-4.101a3 3 0 0 1-2.14-2.693L2 12v-.5a1 1 0 0 1 1.993-.117L4 11.5v.5q.002.224.09.415a6.5 6.5 0 0 1 2.938-4.411A4.5 4.5 0 0 1 11.5 3M17 8.28l-2.758.69l-.12.023L14 9h-3.5a4.5 4.5 0 0 0-2.045 8.51a1 1 0 0 1 .537.766L9 18.4v.6h1a1 1 0 0 1 .883-.993L11 18h3a1 1 0 0 1 .993.883L15 19h1v-.6a1 1 0 0 1 .545-.89a4.52 4.52 0 0 0 2.068-2.18a1 1 0 0 1 .347-.417l.119-.07l.921-.461V13h-.207a1 1 0 0 1-.962-.728a4.5 4.5 0 0 0-1.468-2.244a1 1 0 0 1-.355-.644L17 9.257zM16 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2m-4.5-6a2.5 2.5 0 0 0-2.478 2.169A6.5 6.5 0 0 1 10.5 7h3.377l.07-.017A2.5 2.5 0 0 0 11.5 5"
        ></path>
      </g>
    </svg>
  );
}
