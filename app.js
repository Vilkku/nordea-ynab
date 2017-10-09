const fs = require('fs');
const path = require('path');
const readline = require('readline');
const parseLine = require('./parseLine');

if (!process.argv[2]) {
    console.log('File argument missing!')
    process.exit(9);
}

const fileName = process.argv[2];
const filePath = path.join(__dirname, fileName);

const lineReader = readline.createInterface({
  input: fs.createReadStream(filePath)
});

let rowCounter = 0;
let payments = [];

lineReader.on('line', (line) => {
    rowCounter++;

    // Row 1 is header with account number, row 2 is empty, row 3 is the header row
    if (rowCounter === 1 || rowCounter === 3) {
        return;
    }

    const payment = parseLine(line);

    if (payment) {
        payments.push(payment);
    }
});

lineReader.on('close', () => {
    if (payments.length === 0) {
        console.log('No payments parsed!')
        process.exit(1);
    }

    const outputName = 'nordea-ynab-' + Date.now() + '.csv';

    const output = fs.createWriteStream(outputName);

    output.on('error', (err) => {
        console.log(err);
    });

    output.write('Date,Payee,Memo,Outflow,Inflow' + '\n')

    payments.forEach((payment) => {
        const paymentArr = [
            payment.date,
            payment.payee,
            payment.memo,
            payment.outflow,
            payment.inflow
        ];

        output.write(paymentArr.join(',') + '\n');
    });

    output.end();
});

