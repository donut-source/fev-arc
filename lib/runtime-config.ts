export function shouldUseMockData(): boolean {
  const flag = process.env.USE_MOCK_DATA?.toLowerCase();
  if (flag === 'true') return true;
  if (flag === 'false') return false;

  const url = process.env.DATABASE_URL;
  if (!url) return true;

  // Common placeholder from env.example
  if (url.includes('@hostname/')) return true;
  if (url.includes('username:password@hostname')) return true;

  return false;
}


