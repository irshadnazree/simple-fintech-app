import { Transaction } from '../utils/transactionUtils';

// Simulated API response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  hasMore: boolean;
  nextCursor?: string;
}

interface BalanceResponse {
  available: number;
  pending: number;
  currency: string;
}

interface TransactionDetailResponse {
  transaction: Transaction;
}

// In-memory storage for transactions
let cachedTransactions: Transaction[] = [];

// Simulated API error
export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Simulate network delay
const simulateDelay = (
  minMs: number = 500,
  maxMs: number = 1500
): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Simulate random API errors (1 in 10 requests will fail)
const simulateError = () => {
  if (Math.random() < 0.1) {
    const errors = [
      {
        status: 429,
        message: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
      },
      {
        status: 500,
        message: 'Internal server error, please try again later',
        code: 'INTERNAL_ERROR',
      },
      {
        status: 503,
        message: 'Service unavailable, please try again later',
        code: 'SERVICE_UNAVAILABLE',
      },
    ];
    const error = errors[Math.floor(Math.random() * errors.length)];
    throw new ApiError(error.status, error.message, error.code);
  }
};

// Mock API endpoints
export const api = {
  async getTransactions(
    params: {
      limit?: number;
      cursor?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<ApiResponse<TransactionsResponse>> {
    try {
      await simulateDelay();
      simulateError();

      const { generateMockTransactions } = require('../utils/transactionUtils');
      const limit = params.limit || 20;

      // Generate new transactions only if cache is empty
      if (cachedTransactions.length === 0) {
        cachedTransactions = generateMockTransactions(limit);
      }

      // Simulate pagination
      const hasMore = cachedTransactions.length >= limit;
      const nextCursor = hasMore ? `cursor_${Date.now()}` : undefined;

      return {
        data: {
          transactions: cachedTransactions,
          hasMore,
          nextCursor,
        },
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to fetch transactions');
    }
  },

  async getBalance(): Promise<ApiResponse<BalanceResponse>> {
    try {
      await simulateDelay(300, 800);
      simulateError();

      return {
        data: {
          available: 2459.32,
          pending: 150.0,
          currency: 'USD',
        },
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to fetch balance');
    }
  },

  async refreshTransactions(): Promise<ApiResponse<TransactionsResponse>> {
    try {
      await simulateDelay(500, 1000);
      simulateError();

      const { generateMockTransactions } = require('../utils/transactionUtils');
      // Update cached transactions
      cachedTransactions = generateMockTransactions(20);

      return {
        data: {
          transactions: cachedTransactions,
          hasMore: true,
          nextCursor: `cursor_${Date.now()}`,
        },
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to refresh transactions');
    }
  },

  async getTransactionDetail(
    id: string
  ): Promise<ApiResponse<TransactionDetailResponse>> {
    try {
      await simulateDelay(150, 550);

      // Find the transaction in the cached list
      const transaction = cachedTransactions.find((t) => t.id === id);

      if (!transaction) {
        throw new ApiError(404, 'Transaction not found');
      }

      return {
        data: {
          transaction,
        },
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to fetch transaction details');
    }
  },
};
