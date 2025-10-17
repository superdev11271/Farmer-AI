// ExportTable13.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable13 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({
        totalLiters: 0,
        totalBedrag: 0,
        totalBTWBedrag: 0,
        totalHuishouden: 0,
        totalKalveren: 0,
        totalProbleemmelk: 0


    });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`
            );

            const data = res.data.data || [];

            // Calculate totals from the milk payout data
            let totalLiters = 0;
            let totalBedrag = 0;
            let totalBTWBedrag = 0;
            let totalHuishouden = 0
            let totalKalveren = 0;
            let totalProbleemmelk = 0


            if (data.length > 0) {
                const Data = data[0];
                console.log(Data)

                // Sum up all monthly values for each category
                Object.values(Data["liters"] || {}).forEach(val => totalLiters += Number(val) || 0);
                Object.values(Data["Bedrag"] || {}).forEach(val => totalBedrag += Number(val) || 0);
                Object.keys(Data["BTW_percent"] || {}).forEach(val => totalBTWBedrag += Number(Data["Bedrag"][val]) * Number(Data["BTW_percent"][val]) / 100 || 0);
                Object.values(Data["Huishoudenliters"] || {}).forEach(val => totalHuishouden += Number(val) || 0);
                Object.values(Data["Kalverenliters"] || {}).forEach(val => totalKalveren += Number(val) || 0);
                Object.values(Data["Probleemmelk"] || {}).forEach(val => totalProbleemmelk += Number(val) || 0);

            }
            console.log(totalHuishouden)
            setTotals({ totalLiters, totalBedrag, totalBTWBedrag, totalHuishouden, totalKalveren, totalProbleemmelk });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: {
                    "Totaal Liters": totalLiters,
                    "Totaal Bedrag": totalBedrag,
                    "Totaal BTWBedrag": totalBTWBedrag,
                    "Totaal Huishouden": totalHuishouden,
                    "Totaal Kalveren": totalKalveren,
                    "Totaal Probleemmelk": totalProbleemmelk,
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
                                    Totaal Bedrag
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                    Totaal BTWBedrag
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                    Totaal Huishouden
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                    Totaal Kalveren
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                    Totaal Probleemmelk
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalLiters.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalBedrag.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalBTWBedrag.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalHuishouden.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalKalveren.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalProbleemmelk.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
})

export default ExportTable13
