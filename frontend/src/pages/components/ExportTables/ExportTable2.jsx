// TotalsTable.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TotalsTable = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ totalKg: 0, totalMK: 0, totalJV: 0, totalMV: 0, totalZK: 0, totalExcl: 0, totalIncl: 0 });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `http://192.168.130.162:9004/api/invoice/${categoryIdentifier}`
            );

            const totalExcl = res.data.reduce(
                (sum, inv) => sum + Number(inv.bedrag || 0),
                0
            );
            const totalIncl = res.data.reduce(
                (sum, inv) =>
                    sum +
                    Number(inv.bedrag || 0) +
                    (Number(inv.bedrag || 0) * (Number(inv.btw || 0) / 100)),
                0
            );
            const totalKg = res.data.reduce((sum, inv) => sum + Number(inv.kg || 0), 0);
            const totalMK = res.data.reduce((sum, inv) => sum + Number(inv.mk || 0), 0);
            const totalJV = res.data.reduce((sum, inv) => sum + Number(inv.jv || 0), 0);
            const totalMV = res.data.reduce((sum, inv) => sum + Number(inv.mv || 0), 0);
            const totalZK = res.data.reduce((sum, inv) => sum + Number(inv.zk || 0), 0);

            setTotals({ totalKg, totalMK, totalJV, totalMV, totalZK, totalExcl, totalIncl });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: { "Kg": totalKg, "MK": totalMK, "JV": totalJV, "MV": totalMV, "ZK": totalZK, "Bedrag (excl)[EUR]": totalExcl, "BTW Bedrag[EUR]": totalIncl }
            }])
        } catch (err) {
            toast.error("Failed to fetch invoice data");
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
                                Kg
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Mk
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                JV
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                MV
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                ZK
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Bedrag (excl)
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                BTW Bedrag
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalKg.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalMK.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalJV.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalMV.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalZK.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">€{totals.totalExcl.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                €{totals.totalIncl.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})


export default TotalsTable