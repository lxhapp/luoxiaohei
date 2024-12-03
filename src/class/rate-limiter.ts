export default class RateLimiter {
  private _maxRetries: number;
  private _initialDelay: number;
  private _attempts: Map<string, number>;
  private _locks: Map<string, boolean>;

  constructor(maxRetries: number = 3, initialDelay: number = 1000) {
    this._maxRetries = maxRetries;
    this._initialDelay = initialDelay;
    this._attempts = new Map();
    this._locks = new Map();
  }

  private async _acquire(key: string): Promise<void> {
    while (this._locks.get(key)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this._locks.set(key, true);
  }

  private _release(key: string): void {
    this._locks.delete(key);
  }

  private _calculateDelay(attempt: number): number {
    return Math.min(this._initialDelay * Math.pow(2, attempt), 10000);
  }

  async execute<T>(key: string, operation: () => Promise<T>): Promise<T> {
    try {
      await this._acquire(key);

      let attempt = this._attempts.get(key) || 0;
      let lastError: Error | undefined;

      while (attempt < this._maxRetries) {
        try {
          const result = await operation();
          this._attempts.set(key, 0);
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          attempt++;
          this._attempts.set(key, attempt);

          if (attempt < this._maxRetries) {
            const delay = this._calculateDelay(attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw new Error(
        `Operation failed after ${this._maxRetries} retries. Last error: ${lastError?.message}`
      );
    } finally {
      this._release(key);
    }
  }
}
