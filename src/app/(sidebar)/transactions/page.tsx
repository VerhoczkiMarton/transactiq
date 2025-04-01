import { auth } from '@/auth';

export default async function TransactionsPage() {
  const session = await auth();

  if (!session?.user) {
    return <p className="text-center text-red-500">Please log in to view your transactions.</p>;
  }

  const transactions = [
    { id: 1, description: 'first dinner', amount: 21 },
    { id: 2, description: 'second dinner', amount: 221 },
    { id: 3, description: 'third dinner', amount: 61 },
  ];

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-xl font-bold">Your Transactions</h1>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map(txn => (
            <li key={txn.id} className="rounded border bg-gray-100 p-3">
              {txn.description} - ${txn.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
