// ExportTable17.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable17 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ 
        totalExcl: 0, 
        totalIncl: 0, 
        totalKg: 0, 
        totalKgDs: 0,
        totalMK: 0,
        totalJV: 0,
        totalMV: 0,
        totalZK: 0
    });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`
            );

            const data = res.data.data || [];
            const totalExcl = data.reduce(
                (sum, inv) => sum + Number(inv.Bedrag || 0),
                0
            );
            const totalIncl = data.reduce(
                (sum, inv) =>
                    sum +
                    Number(inv.Bedrag || 0) +
                    (Number(inv.Bedrag || 0) * (Number(inv.BTW || 0) / 100)),
                0
            );
            const totalKg = data.reduce(
                (sum, inv) => sum + Number(inv.kg || 0),
                0
            );
            const totalKgDs = data.reduce(
                (sum, inv) => sum + Number(inv.kg_ds || 0),
                0
            );
            const totalMK = data.reduce(
                (sum, inv) => sum + Number(inv.mk || 0),
                0
            );
            const totalJV = data.reduce(
                (sum, inv) => sum + Number(inv.jv || 0),
                0
            );
            const totalMV = data.reduce(
                (sum, inv) => sum + Number(inv.mv || 0),
                0
            );
            const totalZK = data.reduce(
                (sum, inv) => sum + Number(inv.zk || 0),
                0
            );

            setTotals({ totalExcl, totalIncl, totalKg, totalKgDs, totalMK, totalJV, totalMV, totalZK });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: { 
                    "Bedrag (excl)[EUR]": totalExcl, 
                    "BTW Bedrag[EUR]": totalIncl,
                    "Totaal Kg": totalKg,
                    "Totaal Kg DS": totalKgDs,
                    "Totaal MK": totalMK,
                    "Totaal JV": totalJV,
                    "Totaal MV": totalMV,
                    "Totaal ZK": totalZK
                }
            }])
        } catch (err) {
            toast.error("Failed to fetch product data");
            console.error(err);
        }
    };

    useEffect(() => {
        if (categoryIdentifier) fetchTotals();
    }, [categoryIdentifier]);

    return (
        <div className="card p-6 shadow-md rounded-lg bg-white flex justify-center">
            <div className="w-full max-w-4xl">
                {/* Sub name with custom color */}
                <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                    {sub_index}{item_index ? " - " + item_index : ""}: {sub_name}
                </h3>

                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr>
                            {/* Table headers with custom color */}
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Bedrag (excl)[EUR]
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                BTW Bedrag[EUR]
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Kg
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal Kg DS
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal MK
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal JV
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal MV
                            </th>
                            <th className="border border-gray-300 px-2 py-2 text-center bg-gray-100 text-green-700">
                                Totaal ZK
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-2 py-2 text-center">€{totals.totalExcl.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">€{totals.totalIncl.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalKg.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalKgDs.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalMK.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalJV.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalMV.toFixed(2)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-center">{totals.totalZK.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default ExportTable17
