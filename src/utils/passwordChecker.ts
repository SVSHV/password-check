import crypto from 'crypto';

export async function checkPassword(password: string) {
  // Create SHA-1 hash of the password
  const hash = crypto
    .createHash('sha1')
    .update(password)
    .digest('hex')
    .toUpperCase();

  // Get the first 5 characters of the hash
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    // Query the API with just the prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error('Failed to check password');
    }

    const text = await response.text();
    const hashes = text.split('\n');

    // Look for our hash suffix in the results
    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':');
      if (hashSuffix.trim() === suffix) {
        return { breached: true, count: parseInt(count.trim(), 10) };
      }
    }

    return { breached: false, count: 0 };
  } catch (error) {
    console.error('Error checking password:', error);
    throw error;
  }
}