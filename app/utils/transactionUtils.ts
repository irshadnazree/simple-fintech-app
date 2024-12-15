export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'debit' | 'credit';
  category?: string;
  merchant?: string;
}

// function to group transactions by date
export function groupTransactionsByDate(transactions: Transaction[]): {
  [date: string]: Transaction[];
} {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as { [date: string]: Transaction[] });
}

// Generate mock transaction data
export function generateMockTransactions(count: number = 20): Transaction[] {
  const transactions: Transaction[] = [];
  const merchants = [
    'Shopee',
    'Grab',
    'Zus Coffee',
    'Spotify',
    'Netflix',
    'Lotus',
    'Apple',
    'FoodPanda',
    'Petronas',
    'Watsons',
  ];

  const categories = [
    'Shopping',
    'Groceries',
    'Entertainment',
    'Transportation',
    'Subscriptions',
    'Food & Dining',
    'Health & Wellness',
    'Bills & Utilities',
    'Gas & Fuel',
    'Travel',
  ];

  const descriptions = {
    Shopping: ['Online Purchase', 'In-store Purchase', 'Mobile Order'],
    Groceries: ['Grocery Shopping', 'Weekly Groceries', 'Fresh Produce'],
    Entertainment: [
      'Monthly Subscription',
      'Streaming Service',
      'Digital Content',
    ],
    Transportation: ['Ride Share', 'Taxi Service', 'Transit Pass'],
    'Food & Dining': ['Restaurant Order', 'Food Delivery', 'Coffee & Snacks'],
    'Bills & Utilities': [
      'Monthly Service',
      'Utility Payment',
      'Subscription Fee',
    ],
    'Gas & Fuel': ['Gas Station', 'Fuel Purchase', 'Vehicle Service'],
    Travel: ['Travel Booking', 'Hotel Stay', 'Flight Ticket'],
  };

  // Distribute transactions across the last 30 days
  for (let i = 0; i < count; i++) {
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );

    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const descList = descriptions[category as keyof typeof descriptions] || [
      'Purchase',
    ];
    const descType = descList[Math.floor(Math.random() * descList.length)];

    // Generate more realistic amounts based on category
    let amount;
    switch (category) {
      case 'Groceries':
        amount = 20 + Math.random() * 180; // $20 - $200
        break;
      case 'Entertainment':
      case 'Subscriptions':
        amount = 5 + Math.random() * 45; // $5 - $50
        break;
      case 'Transportation':
        amount = 10 + Math.random() * 90; // $10 - $100
        break;
      case 'Travel':
        amount = 100 + Math.random() * 900; // $100 - $1000
        break;
      default:
        amount = 5 + Math.random() * 195; // $5 - $200
    }

    // Ensure a good mix of debit/credit (80% debit, 20% credit)
    const type = Math.random() < 0.8 ? 'debit' : 'credit';

    transactions.push({
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      date: randomDate,
      description: `${descType} at ${merchant}`,
      type,
      category,
      merchant,
    });
  }

  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Mask sensitive transaction details
export function maskAmount(amount: number): string {
  return `${'*'.repeat(amount.toString().length)}`;
}

export function maskMerchant(merchant: string): string {
  return `${merchant.slice(0, 3)}***`;
}

// Reveal amount after biometric authentication
export function revealAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function revealMerchant(merchant: string): string {
  return merchant;
}
