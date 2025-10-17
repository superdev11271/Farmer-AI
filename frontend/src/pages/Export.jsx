import React, { useState, useEffect } from 'react';
import ExportDataSelector from './components/ExportHeader';
import categories from "../data/categories.json";
import invoice_types from "../data/invoice_types.json";
import ExportTotalsCard1 from './components/ExportTables/ExportTable1';
import ExportTotalsCard2 from './components/ExportTables/ExportTable2';
import ExportTotalsCard3 from './components/ExportTables/ExportTable3';
import ExportTotalsCard4 from './components/ExportTables/ExportTable4';
import ExportTotalsCard5 from './components/ExportTables/ExportTable5';
import ExportTotalsCard6 from './components/ExportTables/ExportTable6';
import ExportTotalsCard7 from './components/ExportTables/ExportTable7';
import ExportTotalsCard8 from './components/ExportTables/ExportTable8';
import ExportTotalsCard9 from './components/ExportTables/ExportTable9';
import ExportTotalsCard10 from './components/ExportTables/ExportTable10';
import ExportTotalsCard11 from './components/ExportTables/ExportTable11';
import ExportTotalsCard12 from './components/ExportTables/ExportTable12';
import ExportTotalsCard13 from './components/ExportTables/ExportTable13';
import ExportTotalsCard14 from './components/ExportTables/ExportTable14';
import ExportTotalsCard15 from './components/ExportTables/ExportTable15';
import ExportTotalsCard16 from './components/ExportTables/ExportTable16';
import ExportTotalsCard17 from './components/ExportTables/ExportTable17';
import ExportTotalsCard18 from './components/ExportTables/ExportTable18';
import ExportTotalsCard19 from './components/ExportTables/ExportTable19';
import ExportTotalsCard20 from './components/ExportTables/ExportTable20';
import ExportTotalsCard21 from './components/ExportTables/ExportTable21';
import ExportTotalsCard22 from './components/ExportTables/ExportTable22';

const Dashboard = () => {
  const [currentCateoryIdentifier, setCurrentCategoryIdentifier] = useState(null);
  const [exportJsonArray, setExportJsonArray] = useState([]);
  useEffect(() => {
    setExportJsonArray([])
  }, [currentCateoryIdentifier])
  const current_excel = categories.filter(category => category.identifier == currentCateoryIdentifier)[0]
  const getCorrectComponent = (key, sub_index, item_index, sub_name, categoryIdentifier) => {
    if (invoice_types.type1.includes(categoryIdentifier))
      return <ExportTotalsCard1 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type2.includes(categoryIdentifier))
      return <ExportTotalsCard2 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type3.includes(categoryIdentifier))
      return <ExportTotalsCard3 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type4.includes(categoryIdentifier))
      return <ExportTotalsCard4 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type5.includes(categoryIdentifier))
      return <ExportTotalsCard5 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type6.includes(categoryIdentifier))
      return <ExportTotalsCard6 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type7.includes(categoryIdentifier))
      return <ExportTotalsCard7 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type8.includes(categoryIdentifier))
      return <ExportTotalsCard8 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type9.includes(categoryIdentifier))
      return <ExportTotalsCard9 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type10.includes(categoryIdentifier))
      return <ExportTotalsCard10 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type11.includes(categoryIdentifier))
      return <ExportTotalsCard11 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type12.includes(categoryIdentifier))
      return <ExportTotalsCard12 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type13.includes(categoryIdentifier))
      return <ExportTotalsCard13 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type14.includes(categoryIdentifier))
      return <ExportTotalsCard14 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type15.includes(categoryIdentifier))
      return <ExportTotalsCard15 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type16.includes(categoryIdentifier))
      return <ExportTotalsCard16 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type17.includes(categoryIdentifier))
      return <ExportTotalsCard17 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type18.includes(categoryIdentifier))
      return <ExportTotalsCard18 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type19.includes(categoryIdentifier))
      return <ExportTotalsCard19 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type20.includes(categoryIdentifier))
      return <ExportTotalsCard20 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type21.includes(categoryIdentifier))
      return <ExportTotalsCard21 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />
    if (invoice_types.type22.includes(categoryIdentifier))
      return <ExportTotalsCard22 key={key} sub_index={sub_index} item_index={item_index} sub_name={sub_name} categoryIdentifier={categoryIdentifier} setExportJsonArray={setExportJsonArray} />

  }
  return (
    <div className="space-y-6">
      <ExportDataSelector exportJsonArray={exportJsonArray} setCurrentCategoryIdentifier={setCurrentCategoryIdentifier} />
      {current_excel && current_excel.sub_items.map((sub_item, index) => {
        if (sub_item.items.length > 0) {
          return <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-6">{sub_item.items.map((item, item_i) =>
            getCorrectComponent(item.identifier, index + 1, item_i + 1, item.name, item.identifier))}</div>
        } else {
          return getCorrectComponent(sub_item.identifier, index + 1, null, sub_item.name, sub_item.identifier)
        }
      })}
    </div>

  );
};

export default Dashboard; 