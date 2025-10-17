// ExportTable13.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable13 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ 
        totalLiters: 0, 
        totalVoorschot: 0, 
        totalMelkgeld: 0, 
        totalOntvangen: 0 
    });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`
            );

            const data = res.data.data || [];
            
            // Calculate totals from the milk payout data
            let totalLiters = 0;
            let totalVoorschot = 0;
            let totalMelkgeld = 0;
            let totalOntvangen = 0;

            if (data.length > 0) {
                const milkData = data[0].data;
                
                // Sum up all monthly values for each category
                // Object.values(milkData["liters"] || {}).forEach(val => totalLiters += Number(val) || 0);
                // Object.values(milkData["voorschotOntvangen"] || {}).forEach(val => totalVoorschot += Number(val) || 0);
                // Object.values(milkData["totaalMelkgeld"] || {}).forEach(val => totalMelkgeld += Number(val) || 0);
                // Object.values(milkData["totaalOntvangen"] || {}).forEach(val => totalOntvangen += Number(val) || 0);
            }

            setTotals({ totalLiters, totalVoorschot, totalMelkgeld, totalOntvangen });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: { 
                    "Totaal Liters": totalLiters, 
                    "Totaal Voorschot[EUR]": totalVoorschot, 
                    "Totaal Melkgeld[EUR]": totalMelkgeld, 
                    "Totaal Ontvangen[EUR]": totalOntvangen 
                }
            }])
        } catch (err) {
            toast.error("Failed to fetch milk payout data");
            console.error(err);
        }
    };

    useEffect(() => {
        if (categoryIdentifier) fetchTotals();
    }, [categoryIdentifier]);

    return (
        <div className="card p-6 shadow-md rounded-lg bg-white flex justify-center">
            <div className="w-full max-w-xl">
                {/* Sub name with custom color */}
                <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                    {sub_index}{item_index ? " - " + item_index : ""}: {sub_name}
                </h3>

                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr>
                            {/* Table headers with custom color */}
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Liters
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Voorschot[EUR]
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Melkgeld[EUR]
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Ontvangen[EUR]
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalLiters.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">€{totals.totalVoorschot.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">€{totals.totalMelkgeld.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">€{totals.totalOntvangen.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default ExportTable13
