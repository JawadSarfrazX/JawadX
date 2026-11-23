export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
export const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const formatCurrency = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
