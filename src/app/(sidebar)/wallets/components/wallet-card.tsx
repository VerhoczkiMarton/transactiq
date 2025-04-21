'use client';

import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { WalletType } from '@prisma/client';
import { deleteWallet } from '../action';
import { Badge } from '@/components/ui/badge';

interface WalletCardProps {
  wallet: {
    id: string;
    name: string;
    balance: number;
    currency: string;
    type: WalletType;
    userId: string;
  };
}

export function WalletCard({ wallet }: WalletCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteWallet(wallet.id)
        .then(() => toast.success('Wallet deleted!'))
        .catch(() => toast.error('Failed to delete wallet'));
    });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{wallet.name}</CardTitle>
        <Badge variant={wallet.type === 'MANUAL' ? 'outline' : 'default'}>
          {wallet.type === 'MANUAL' ? 'Manual' : 'Synchronized'}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
      </CardContent>

      <CardFooter className="text-muted-foreground flex justify-between pt-0 text-sm">
        <span>{wallet.currency}</span>
        <div className="flex gap-2">
          <Button size="icon" variant="destructive" onClick={handleDelete} disabled={isPending}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
