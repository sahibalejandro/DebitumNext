export async function catchError<T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error]> {
  return promise
    .then((result) => [undefined, result] as [undefined, T])
    .catch((error) => [error]);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error?.toString) {
    return error.toString();
  }

  return 'getErrorMessage: Unknown error';
}

export function defaultErrorHandler(...messages: string[]): void {
  console.error(...messages);
}
