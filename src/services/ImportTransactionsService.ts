import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface Transactions {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transactions[]> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      `${fileName}`,
    );

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: Transactions[] = [];
    await lines.map(file => {
      const transaction: Transactions = {
        title: file[0],
        value: parseFloat(file[2]),
        type: file[1] === 'income' ? 'income' : 'outcome',
        category: file[3],
      };

      transactions.push(transaction);
    });
    return transactions;
  }
}

export default ImportTransactionsService;
