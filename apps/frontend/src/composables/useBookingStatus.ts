export function useBookingStatus() {
  const statusMap: Record<string, { label: string; class: string }> = {
    pending: { label: 'Menunggu Konfirmasi', class: 'badge-pending' },
    confirmed: { label: 'Dikonfirmasi', class: 'badge-confirmed' },
    paid: { label: 'Lunas', class: 'badge-paid' },
    ongoing: { label: 'Berlangsung', class: 'badge-confirmed' },
    completed: { label: 'Selesai', class: 'badge-completed' },
    cancelled: { label: 'Dibatalkan', class: 'badge-cancelled' },
  };

  function getStatus(status: string) {
    return statusMap[status] || { label: status, class: 'badge-pending' };
  }

  return { getStatus };
}
