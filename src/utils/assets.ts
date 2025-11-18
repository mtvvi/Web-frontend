const trimTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, '');

export const resolvePublicAsset = (assetPath: string): string => {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = trimTrailingSlash(base);
  const normalizedAsset = trimLeadingSlash(assetPath);
  return `${normalizedBase}/${normalizedAsset}`;
};
