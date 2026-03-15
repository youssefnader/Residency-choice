import * as XLSX from 'xlsx';

/**
 * Parses a candidates Excel file and returns an array of objects.
 * Expected columns: الترتيب (Rank), الاسم (Name), النسبة المئوية (Percentage), المجموع (Score)
 */
export const parseCandidatesExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Arabic columns to our schema
        const mappedData = jsonData.map(row => ({
          full_name: row['الاسم '] || row['الاسم'] || '',
          score: parseFloat(row['المجموع 4525'] || row['المجموع'] || 0),
          rank: parseInt(row['الترتيب'] || 0)
        })).filter(p => p.full_name);

        resolve(mappedData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generic Excel export utility
 */
export const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
