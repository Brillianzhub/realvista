// utils/formatCurrency.js
export const formatCurrency = (amount, currency) => {
    const locale = currency === "NGN" ? "en-NG" : "en-US";  // Default to "en-US" for other currencies

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,  // Use the currency code (e.g., 'USD', 'EUR', 'NGN')
        minimumFractionDigits: 2,  // Ensures 2 decimal places
    }).format(amount);
};
