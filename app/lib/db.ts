const TRANSIENT_DB_ERROR_CODES = new Set([
  "EAI_AGAIN",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "P1001",
  "P1002",
  "P1008",
  "P1017",
]);

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const record = error as { code?: string; meta?: { code?: string } };
  return record.code ?? record.meta?.code;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "";
}

export function isTransientDbError(error: unknown): boolean {
  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  if (code && TRANSIENT_DB_ERROR_CODES.has(code)) {
    return true;
  }

  return /EAI_AGAIN|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|Can't reach database server/i.test(
    message,
  );
}

export function getDbErrorMessage(error: unknown): string {
  if (isTransientDbError(error)) {
    return "Unable to reach the database. Check your internet connection and try again.";
  }

  return "A database error occurred. Please try again.";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isTransientDbError(error) || attempt === retries) {
        throw error;
      }

      await wait(500 * (attempt + 1));
    }
  }

  throw lastError;
}
