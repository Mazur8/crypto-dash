function CryptoCard({ name, price, symbol, priceChange, currency }) {
  const isPositive = priceChange > 0;

  const getCurrencySymbol = (curr) => {
    if (curr ==="pln") return "zł";
    if (curr ==="eur") return "€";
    return "$";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-48 text-center">
      <h2 className="text-gray-500 text-sm font-semibold">
        {symbol && <span className="uppercase mr-1">({symbol.toUpperCase()})</span>}
        {name}
        </h2>
      <p className="text-xl font-bold mt-2">
        {price ? `${price} ${getCurrencySymbol(currency)}` : "Ładowanie..."}
      </p>
      <p className={`font-bold mt-2 ${isPositive ? 'text-green-500': 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
      </p>
    </div>
  );
}
export default CryptoCard;
