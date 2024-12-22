// utils/formatCurrency.js
export const formatCurrency = (amount, currency) => {
    const locale = currency === "NGN" ? "en-NG" : "en-US";

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};
