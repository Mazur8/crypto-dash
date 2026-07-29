import { useState } from "react"
import { useEffect } from "react"
import CryptoCard from "./CryptoCard";

function App() {

  const [cryptoList, setCryptoList]=useState([]);
  const [error, setError]=useState(false);
  const [searchTerm, setSearchTerm]=useState("");
  const [timeFilter, setTimeFilter]=useState("24h");
  const [currency, setCurrency]=useState("usd");

  useEffect(()=>{
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const fetchData = () => {
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&price_change_percentage=7d,30d,1y&x_cg_demo_api_key=${apiKey}`)
      .then(res => {
        if(!res.ok){
          throw new Error('Błąd pobierania danych')
        } 
        return res.json()
        })
      .then(data => setCryptoList(data))
      .catch(err => setError(err))
    }
 
    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId)
  }, [currency]);

  const filteredCrypto = cryptoList.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriceChange = (crypto) => {
    let value = crypto.price_change_percentage_24h;
    if (timeFilter === "7 dni") value = crypto.price_change_percentage_7d_in_currency;
    if (timeFilter === "30 dni") value = crypto.price_change_percentage_30d_in_currency;
    if (timeFilter === "1 rok") value = crypto.price_change_percentage_1y;
    return value !== undefined && value !==null ? value : 0;
  } 

  const displayedCrypto = searchTerm === "" ? filteredCrypto.slice(0,5) : filteredCrypto;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="max-w-full text-center mb-10 text-4xl font-bold">CryptoDash</h1>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Szukaj kryptowaluty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <p className="text-center pb-3 text-2xl font-medium">Okres cen kryptowalut</p>
      <div className="flex gap-2 justify-center pb-6">
        {["24h", "7 dni", "30 dni", "1 rok"].map((s) => (
          <button
            key={s}
            onClick={()=>setTimeFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeFilter === s 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-center pb-3 text-2xl font-medium">Wybierz walute</p>
      <div className="flex gap-2 justify-center pb-6">
        {["usd", "pln", "eur"].map((curr) => (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currency===curr
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
            }`}  
          >
            {curr}
          </button>
        ))}
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
            displayedCrypto.map((crypto)=>(
              <CryptoCard 
                key={crypto.id}
                name={crypto.name} 
                price={crypto.current_price}
                symbol={crypto.symbol}
                priceChange={getPriceChange(crypto)}
                currency={currency}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App
