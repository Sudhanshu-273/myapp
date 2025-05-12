export const formatNumber = (amount) => {
  let formattedTotal = 0;

  if (amount >= 1_000_000) {
    formattedTotal = (amount / 1_000_000).toFixed(1) + 'M';
  } else if (amount >= 1_000) {
    formattedTotal = (amount / 1_000).toFixed(1) + 'K';
  } else {
    formattedTotal = amount;
  }

  return formattedTotal;
};

  
  export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  