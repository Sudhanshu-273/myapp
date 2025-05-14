export const formatNumber = (amount) => {
  return amount;
};

  
  export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  