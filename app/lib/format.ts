export function formatNairaAmount(amountNgn: number): string {
  return `₦${amountNgn.toLocaleString("en-NG")}`;
}
