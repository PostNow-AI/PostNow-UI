export const getSubscriptionStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return "✅";
    case "cancelled":
      return "❌";
    case "expired":
      return "⏰";
    default:
      return "❓";
  }
};

export const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "expired":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getIntervalIcon = (interval: string) => {
  switch (interval) {
    case "monthly":
      return "📅";
    case "quarterly":
      return "📊";
    case "semester":
      return "🗓️";
    case "yearly":
      return "📆";
    case "lifetime":
      return "♾️";
    default:
      return "⏰";
  }
};

export const formatSubscriptionInterval = (interval: string) => {
  switch (interval) {
    case "monthly":
      return "Mensal";
    case "quarterly":
      return "Trimestral";
    case "semester":
      return "Semestral";
    case "yearly":
      return "Anual";
    case "lifetime":
      return "Vitalício";
    default:
      return interval;
  }
};

export const getDaysUntilExpiry = (endDate: string | null): number | null => {
  if (!endDate) return null;

  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const isSubscriptionExpiringSoon = (
  endDate: string | null,
  days: number = 7
): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(endDate);
  return (
    daysUntilExpiry !== null && daysUntilExpiry <= days && daysUntilExpiry >= 0
  );
};
