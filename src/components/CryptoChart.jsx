import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

function CryptoChart({chartData, selectedCrypto, currency, timeFilter}){

    const formattedData = chartData.map(([timestamp, price]) => {
        const date = new Date(timestamp)

        const timeLabel = timeFilter === "24h"
        ? date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
        : date.toLocaleDateString([], {day: "2-digit", month: "short", year: "2-digit"});

        return {
            time: timeLabel,
            price: price,
            formattedPrice: Math.abs(price).toFixed(2),
        };
    });

    if (!selectedCrypto) return null

    return(
        <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                Wykres ceny: <span className="text-indigo-600">{selectedCrypto.name}</span> ({currency.toUpperCase()})
            </h3>
            
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={12}/>
                        <YAxis domain={["auto", "auto"]} stroke="#9ca3af" fontSize={12}/>
                        <Tooltip 
                            formatter={(value) => [`${Number(value).toFixed(2)} ${currency.toUpperCase()}`, "Cena"]}
                            labelStyle={{color: "#374151"}}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
export default CryptoChart;