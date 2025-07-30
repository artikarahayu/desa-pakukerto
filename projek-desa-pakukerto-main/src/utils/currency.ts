/**
 * Format a number as Indonesian Rupiah
 * @param amount The amount to format
 * @param withSymbol Whether to include the Rp symbol (default: true)
 * @returns Formatted currency string
 */
export const formatRupiah = (amount: number, withSymbol: boolean = true): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return withSymbol ? 'Rp 0' : '0';
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const formatted = formatter.format(amount);
  
  // Remove the currency symbol if not needed
  if (!withSymbol) {
    return formatted.replace(/[^\d.]/g, '');
  }
  
  // Replace IDR with Rp for better readability
  return formatted.replace('IDR', 'Rp');
};

/**
 * Parse a string in Rupiah format to a number
 * @param rupiahString The string to parse (e.g., "Rp 1.000.000" or "1.000.000")
 * @returns The parsed number or 0 if invalid
 */
export const parseRupiah = (rupiahString: string): number => {
  if (!rupiahString) return 0;
  
  // Remove currency symbol, dots, and other non-numeric characters
  const numericString = rupiahString.replace(/[^\d]/g, '');
  
  // Parse as integer
  const value = parseInt(numericString, 10);
  
  return isNaN(value) ? 0 : value;
};
