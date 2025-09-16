import XLSX from 'xlsx';

const ExcelExporter = (data, fileName, columnConfig) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const columns = columnConfig ? columnConfig.map(config => config.key) : Object.keys(data[0]);
  const headerRow = columnConfig ? columnConfig.map(config => config.name) : columns;
  const wsData = [headerRow];

  data.forEach(item => {
    const rowData = columns.map(column => {
      const config = columnConfig.find(config => config.key === column);
      return config ? item[config.key] : item[column];
    });
    wsData.push(rowData);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet");

  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export default ExcelExporter;