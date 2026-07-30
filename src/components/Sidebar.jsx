function SideBar({
  isMenuOpen,
  setIsMenuOpen,
  showFavoritesOnly,
  setShowFavoritesOnly,
  clearFavorite,
  sortBy,
  setSortBy,
  timeFilter,
  setTimeFilter,
  currency,
  setCurrency,
  itemLimit,
  setItemLimit,
}) {
  return (
    <>
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
          <div className="flex justify-center pb-3">
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
          <div className="flex justify-center pb-3">
            <button
              onClick={clearFavorite}
              className="px-5 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition-colors"
            >
              Wyczyść ulubione
            </button>
          </div>
        </div>

        <div>
          <p className="text-center pb-3 text-2xl font-medium">Sortowanie</p>
          <div className="flex flex-col items-center gap-2 pb-6">
            {[
              "Brak",
              "Cena rosnąco",
              "Cena malejąco",
              "Nazwa rosnąco",
              "Nazwa malejąco",
            ].map((sorted) => (
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
            Liczba kryptowalut:{" "}
            <span className="font-bold text-indigo-600">{itemLimit}</span>
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
    </>
  );
}
export default SideBar;
