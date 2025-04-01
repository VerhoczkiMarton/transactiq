'use server';

import { signIn, signOut } from 'next-auth/react';

const SignIn = async () => {
  return await signIn();
};

const SignOut = async () => {
  return await signOut();
};

export { SignIn, SignOut };
