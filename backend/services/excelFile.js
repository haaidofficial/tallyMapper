const XLSX = require('xlsx');

const excelData = (jsonData, apiName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${apiName}}`);
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const stream = Buffer.from(excelBuffer)
    return stream;
}

module.exports = {
    excelData
}