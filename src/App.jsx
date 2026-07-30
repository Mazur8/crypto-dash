import { useState } from "react";
import { useEffect } from "react";
import CryptoCard from "./components/CryptoCard";
import SideBar from "./components/Sidebar";
import CryptoChart from "./components/CryptoChart";

function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [currency, setCurrency] = useState("usd");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [itemLimit, setItemLimit] = useState(5);
  const [sortBy, setSortBy] = useState("Brak");
  const [selectedCrypto, setSelectedCrypto] = useState(null);

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
    const fetchData = () => {
      const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
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


  useEffect(()=>{
    if(!selectedCrypto) return;

    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

    let days = "1";
    if (timeFilter === "7 dni") days = "7";
    if (timeFilter === "30 dni") days = "30";
    if (timeFilter === "1 rok") days = "365";

    fetch(`https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=${currency}&days=${days}&x_cg_demo_api_key=${apiKey}`)
    .then((res) => {
      if(!res.ok) throw new Error("Błąd pobierania wykresu");
      return res.json()
    })
    .then((data) => setChartData(data.prices))
    .catch((err) => console.log("Nie udało się pobrać danych:", err));
  }, [selectedCrypto, currency, timeFilter])



  const toggleFavorite = (id) => {
    if (favoritesCrypto.includes(id)) {
      setFavoritesCrypto(favoritesCrypto.filter((favID) => favID !== id));
    } else {
      setFavoritesCrypto([...favoritesCrypto, id]);
    }
  };

  const clearFavorite = () => {
    localStorage.removeItem("cryptoFavorites");
    setFavoritesCrypto([]);
  }

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

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Szukaj kryptowaluty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
      <SideBar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        clearFavorite={clearFavorite}
        sortBy={sortBy}
        setSortBy={setSortBy}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        currency={currency}
        setCurrency={setCurrency}
        itemLimit={itemLimit}
        setItemLimit={setItemLimit}
      />
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
                onSelect={() => setSelectedCrypto(crypto)}
              />
            ))
          )}
        </div>
      )}
       <CryptoChart
        chartData={chartData}
        selectedCrypto={selectedCrypto}
        currency={currency}
        timeFilter={timeFilter}
      />
    </div>
  );
}

export default App;
