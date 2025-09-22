export const getTransactionIcon = (type: string) => {
  switch (type) {
    case "purchase":
      return "💰";
    case "usage":
      return "🤖";
    case "refund":
      return "↩️";
    case "bonus":
      return "🎁";
    case "adjustment":
      return "⚙️";
    default:
      return "📊";
  }
};

export const getTransactionColor = (type: string) => {
  switch (type) {
    case "purchase":
      return "bg-green-100 text-green-800";
    case "usage":
      return "bg-blue-100 text-blue-800";
    case "refund":
      return "bg-orange-100 text-orange-800";
    case "bonus":
      return "bg-purple-100 text-purple-800";
    case "adjustment":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
