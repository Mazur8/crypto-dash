function CryptoCard({ name, price, symbol, priceChange }) {
  const isPositive = priceChange > 0;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-48 text-center">
      <h2 className="text-gray-500 text-sm font-semibold">
        {symbol && <span className="uppercase mr-1">({symbol})</span>}
        {name}
        </h2>
      <p className="text-xl font-bold mt-2">
        {price ? `$${price}` : "Ładowanie..."}
      </p>
      <p className={`font-bold mt-2 ${isPositive ? 'text-green-500': 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
      </p>
    </div>
  );
}
export default CryptoCard;
