// // utils/formatCurrency.js
// export const formatCurrency = (amount, currency) => {
//     const locale = currency === "NGN" ? "en-NG" : "en-US";

//     return new Intl.NumberFormat(locale, {
//         style: 'currency',
//         currency: currency,
//         minimumFractionDigits: 2,
//     }).format(amount);
// };

const currencySymbols = {
    NGN: "₦",
    GHS: "₵",
    USD: "$",
    GBP: "£",
    EUR: "€",
    JPY: "¥",
    ZAR: "R",
    ZMW: "K",

    // Add more symbols as needed
};

export const formatCurrency = (amount, currency) => {
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(amount)}`;
};
