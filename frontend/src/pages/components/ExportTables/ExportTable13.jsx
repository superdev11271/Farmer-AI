// ExportTable13.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable13 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({
        totalLiters: 0,
        Vetgehalte: 0,
        Eiwitgehalte: 0
    });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`
            );

            const data = res.data.data || [];

            // Calculate totals from the milk payout data
            let totalLiters = 0;
            let Vetgehalte = 0;
            let Eiwitgehalte = 0;

            if (data.length > 0) {
                const Data = data[0];

                // Sum up all monthly values for each category
                Object.values(Data["liters"] || {}).forEach(val => totalLiters += Number(val) || 0);
                if (totalLiters > 0) {
                    Object.keys(Data["vetgehalte"] || {}).forEach(val => Vetgehalte += Number(Data["vetgehalte"][val]) * Number(Data["liters"][val]) || 0);
                    Object.keys(Data["eiwitgehalte"] || {}).forEach(val => Eiwitgehalte += Number(Data["eiwitgehalte"][val]) * Number(Data["liters"][val]) || 0);
                    Vetgehalte /= totalLiters
                    Eiwitgehalte /= totalLiters
                }
            }

            setTotals({ totalLiters, Vetgehalte, Eiwitgehalte });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: {
                    "Totaal Liters": totalLiters,
                    "Totaal Voorschot": Vetgehalte,
                    "Totaal Eiwitgehalte": Eiwitgehalte
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
            <div className="w-full">
                <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                    {sub_index}{item_index ? " - " + item_index : ""}: {sub_name}
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center min-w-max">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Liters
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Voorschot
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Eiwitgehalte
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalLiters.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.Vetgehalte.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.Eiwitgehalte.toFixed(2)}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
})

export default ExportTable13
