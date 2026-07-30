function CryptoCard({
  name,
  price,
  symbol,
  priceChange,
  currency,
  isFavorite,
  onToggleFavorite,
}) {
  const isPositive = priceChange > 0;

  const getCurrencySymbol = (curr) => {
    if (curr === "pln") return "zł";
    if (curr === "eur") return "€";
    return "$";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-48 relative flex flex-col">
      <button
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform cursor-pointer "
      >
        <span
          className={
            isFavorite
              ? "text-amber-400 hover:text-amber-500"
              : "text-gray-400 hover:text-gray-500"
          }
        >
          {isFavorite ? "★" : "☆"}
        </span>
      </button>
      <div className="flex flex-col items-center justify-center flex-grow:1 text-center pt-5">
        <h2 className="text-gray-500 text-sm font-semibold">
          {symbol && (
            <span className="uppercase mr-1">({symbol.toUpperCase()})</span>
          )}
          {name}
        </h2>
        <p className="text-xl font-bold mt-2">
          {price ? `${price} ${getCurrencySymbol(currency)}` : "Ładowanie..."}
        </p>
        <p
          className={`font-bold mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
export default CryptoCard;
