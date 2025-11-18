export const isTauriEnvironment = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const maybeWindow = window as unknown as Record<string, unknown>;
  return Boolean(maybeWindow.__TAURI_INTERNALS__);
};
