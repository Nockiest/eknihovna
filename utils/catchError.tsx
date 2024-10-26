type Result<T> = [T, null] | [null, Error];

async function catchError<T>(promise: Promise<T>): Promise<[undefined,T]|[Error]> {
  try {
    const data = await promise;
    return [undefined, data] as [undefined, T]
  } catch (error) {
    return [ error instanceof Error ? error : new Error(String(error))];
  }
}

export default catchError