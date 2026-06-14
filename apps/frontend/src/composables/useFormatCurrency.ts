export function useFormatCurrency() {
  function formatIDR(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  }
  return { formatIDR };
}
