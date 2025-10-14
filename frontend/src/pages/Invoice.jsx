import { useState } from "react";
import CategorySelector from "./components/CategorySelector";
import invoice_types from "../data/invoice_types.json"

import InvoiceTable1 from "./components/InvoiceTables/InvoiceTable1";
import InvoiceTable2 from "./components/InvoiceTables/InvoiceTable2";
import InvoiceTable3 from "./components/InvoiceTables/InvoiceTable3";
import InvoiceTable4 from "./components/InvoiceTables/InvoiceTable4";
import InvoiceTable5 from "./components/InvoiceTables/InvoiceTable5";
import InvoiceTable6 from "./components/InvoiceTables/InvoiceTable6";
import InvoiceTable7 from "./components/InvoiceTables/InvoiceTable7";
import InvoiceTable8 from "./components/InvoiceTables/InvoiceTable8";
import InvoiceTable9 from "./components/InvoiceTables/InvoiceTable9";
import InvoiceTable10 from "./components/InvoiceTables/InvoiceTable10";
import InvoiceTable11 from "./components/InvoiceTables/InvoiceTable11";
import InvoiceTable12 from "./components/InvoiceTables/InvoiceTable12";
import InvoiceTable13 from "./components/InvoiceTables/InvoiceTable13";
import InvoiceTable14 from "./components/InvoiceTables/InvoiceTable14";
import InvoiceTable15 from "./components/InvoiceTables/InvoiceTable15";
import InvoiceTable16 from "./components/InvoiceTables/InvoiceTable16";
import InvoiceTable17 from "./components/InvoiceTables/InvoiceTable17";
import InvoiceTable18 from "./components/InvoiceTables/InvoiceTable18";
import InvoiceTableR1_1 from "./components/InvoiceTables/InvoiceTableR1-1";
import InvoiceTableR1_4 from "./components/InvoiceTables/InvoiceTableR1-4";
import InvoiceTableR8_2 from "./components/InvoiceTables/InvoiceTableR8-2";


const Invoices = () => {

  const [currentCateoryIdentifier, setCurrentCategoryIdentifier] = useState(null);

  return (
    <div className="space-y-6">
      <CategorySelector setCurrentCategoryIdentifier={setCurrentCategoryIdentifier} />
      {invoice_types.type1.includes(currentCateoryIdentifier) && <InvoiceTable1 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type2.includes(currentCateoryIdentifier) && <InvoiceTable2 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type3.includes(currentCateoryIdentifier) && <InvoiceTable3 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type4.includes(currentCateoryIdentifier) && <InvoiceTable4 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type5.includes(currentCateoryIdentifier) && <InvoiceTable5 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type6.includes(currentCateoryIdentifier) && <InvoiceTable6 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type7.includes(currentCateoryIdentifier) && <InvoiceTable7 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type8.includes(currentCateoryIdentifier) && <InvoiceTable8 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type9.includes(currentCateoryIdentifier) && <InvoiceTable9 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type10.includes(currentCateoryIdentifier) && <InvoiceTable10 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type11.includes(currentCateoryIdentifier) && <InvoiceTable11 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type12.includes(currentCateoryIdentifier) && <InvoiceTable12 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type13.includes(currentCateoryIdentifier) && <InvoiceTable13 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type14.includes(currentCateoryIdentifier) && <InvoiceTable14 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type15.includes(currentCateoryIdentifier) && <InvoiceTable15 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type16.includes(currentCateoryIdentifier) && <InvoiceTable16 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type17.includes(currentCateoryIdentifier) && <InvoiceTable17 categoryIdentifier={currentCateoryIdentifier} />}
      {invoice_types.type18.includes(currentCateoryIdentifier) && <InvoiceTable18 categoryIdentifier={currentCateoryIdentifier} />}

      {currentCateoryIdentifier == "R1-1" && <InvoiceTableR1_1 categoryIdentifier={currentCateoryIdentifier}/>}
      {currentCateoryIdentifier == "R1-4" && <InvoiceTableR1_4 categoryIdentifier={currentCateoryIdentifier}/>}
      {currentCateoryIdentifier == "R8-2" && <InvoiceTableR8_2 categoryIdentifier={currentCateoryIdentifier}/>}
    </div>
  );
};

export default Invoices;
