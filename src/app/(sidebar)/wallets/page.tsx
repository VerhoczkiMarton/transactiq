import { formatCurrency } from '@/lib/utils';
import { WalletIcon } from 'lucide-react';
import { Suspense } from 'react';
import { getWallets } from './action';
import { CreateWalletTrigger } from './components/create-wallet-trigger';
import { WalletCard } from './components/wallet-card';

function WalletsLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted mb-2 h-10 w-36 rounded"></div>
      <div className="bg-muted mb-8 h-6 w-48 rounded"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-muted h-40 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

async function WalletsList() {
  const wallets = await getWallets();

  return (
    <>
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">My Wallets</h1>
          {Object.entries(
            wallets.reduce<Record<string, number>>((acc, wallet) => {
              const currency = wallet.currency;
              acc[currency] = (acc[currency] ?? 0) + Number(wallet.balance);
              return acc;
            }, {})
          ).map(([currency, total]) => (
            <p key={currency} className="text-muted-foreground">
              Total in {currency}: {formatCurrency(total, currency)}
            </p>
          ))}
        </div>
        <CreateWalletTrigger />
      </div>

      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
          <WalletIcon className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No wallets yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first wallet to start tracking your finances
          </p>
          <CreateWalletTrigger />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map(wallet => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      )}
    </>
  );
}

export default function WalletsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<WalletsLoading />}>
        <WalletsList />
      </Suspense>
    </div>
  );
}
