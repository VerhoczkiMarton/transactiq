'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateWalletDialog } from './create-wallet-dialog';

export function CreateWalletTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="default">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Wallet
      </Button>
      <CreateWalletDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
