import { useState } from "react";
import { useEffect } from "react";
import CryptoCard from "./CryptoCard";

function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [currency, setCurrency] = useState("usd");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [itemLimit, setItemLimit] = useState(5);
  const [sortBy, setSortBy] = useState("Brak");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [favoritesCrypto, setFavoritesCrypto] = useState(() => {
    try {
      const data = localStorage.getItem("cryptoFavorites");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn("Brak dostępu do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const fetchData = () => {
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&price_change_percentage=7d,30d,1y&x_cg_demo_api_key=${apiKey}`,
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Błąd pobierania danych");
          }
          return res.json();
        })
        .then((data) => setCryptoList(data))
        .catch((err) => setError(err));
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, [currency]);

  useEffect(() => {
    try {
      const data = JSON.stringify(favoritesCrypto);
      localStorage.setItem("cryptoFavorites", data);
    } catch (error) {
      console.warn("Nie udało się zapisać do localStorage:", error);
    }
  }, [favoritesCrypto]);

  const toggleFavorite = (id) => {
    if (favoritesCrypto.includes(id)) {
      setFavoritesCrypto(favoritesCrypto.filter((favID) => favID !== id));
    } else {
      setFavoritesCrypto([...favoritesCrypto, id]);
    }
  };

  const sortedCrypto = [...cryptoList].sort((a,b) =>{
    if(sortBy === "Cena rosnąco") return a.current_price - b.current_price
    if(sortBy === "Cena malejąco") return b.current_price - a.current_price
    if(sortBy === "Nazwa rosnąco") return a.name.localeCompare(b.name);
    if(sortBy === "Nazwa malejąco") return b.name.localeCompare(a.name);
    return 0;
  });

  const filteredCrypto = sortedCrypto.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );


  const getPriceChange = (crypto) => {
    let value = crypto.price_change_percentage_24h;
    if (timeFilter === "7 dni")
      value = crypto.price_change_percentage_7d_in_currency;
    if (timeFilter === "30 dni")
      value = crypto.price_change_percentage_30d_in_currency;
    if (timeFilter === "1 rok") 
      value = crypto.price_change_percentage_1y;
    return value !== undefined && value !== null ? value : 0;
  };

  const baseCrypto = showFavoritesOnly
    ? filteredCrypto.filter((crypto) => favoritesCrypto.includes(crypto.id))
    : filteredCrypto;

  const displayedCrypto =
    searchTerm === "" && !showFavoritesOnly ? baseCrypto.slice(0, itemLimit) : baseCrypto;

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="max-w-4xl mx-auto flex justify-center items-center mb-10">
        <h1 className="text-4xl font-bold">CryptoDash</h1>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute right-5 bg-white p-3 rounded-xl shadow-md text-2xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-800">
            Filtry i ustawienia
          </h3>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl text-gray-500 hover:text-gray-800 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <div>
          <div className="flex justify-center pb-6">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                showFavoritesOnly
                  ? "bg-amber-500 text-white font-bold"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showFavoritesOnly ? "★ Pokaż wszystkie" : "★ Tylko ulubione"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-center pb-3 text-2xl font-medium">
            Sortowanie
          </p>
          <div className="flex flex-col items-center gap-2 pb-6">
            {["Brak","Cena rosnąco", "Cena malejąco", "Nazwa rosnąco", "Nazwa malejąco"].map((sorted) => (
              <button
                key={sorted}
                onClick={() => setSortBy(sorted)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sortBy === sorted
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                }`}
              >
                {sorted}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center pb-3 text-2xl font-medium">
            Okres cen kryptowalut
          </p>
          <div className="flex gap-2 justify-center pb-6">
            {["24h", "7 dni", "30 dni", "1 rok"].map((s) => (
              <button
                key={s}
                onClick={() => setTimeFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  timeFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center pb-3 text-2xl font-medium">
            Wybierz walute
          </p>
          <div className="flex gap-2 justify-center pb-6">
            {["usd", "pln", "eur"].map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currency === curr
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>


        <div>
          <p className="text-center pb-2 text-lg font-medium text-gray-700">
            Liczba kryptowalut: <span className="font-bold text-indigo-600">{itemLimit}</span>
          </p>
          <div className="flex flex-col items-center px-4">
            <input
              type="range"
              min="1"
              max="50"
              value={itemLimit}
              onChange={(e) => setItemLimit(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>
        </div>
      
      </div>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Szukaj kryptowaluty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {error ? (
        <p className="text-center text-red-500 font-bold">Wystąpił błąd</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {cryptoList.length === 0 ? (
            <p className="text-gray-500">Ładowanie kryptowalut...</p>
          ) : displayedCrypto.length === 0 ? (
            <p className="text-gray-500">Brak wyników wyszukiwania</p>
          ) : (
            displayedCrypto.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                name={crypto.name}
                price={crypto.current_price}
                symbol={crypto.symbol}
                priceChange={getPriceChange(crypto)}
                currency={currency}
                isFavorite={favoritesCrypto.includes(crypto.id)}
                onToggleFavorite={() => toggleFavorite(crypto.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
