function parseLine (line) {
    if (line === '') {
        return null;
    }

    const lineArr = line.split('\t');

    // 0 - Bokningsdag
    // 1 - Valutadag
    // 2 - Betalningsdag
    // 3 - Belopp
    // 4 - Mottagare/Betalare
    // 5 - Kontonummer
    // 6 - BIC
    // 7 - Kontotransaktion
    // 8 - Referens
    // 9 - Betalarens referens
    // 10 - Meddelande
    // 11 - Kortets nummer
    // 12 - Kvitto

    const dateParts = lineArr[2].split('.');

    const date = dateParts[0] + '/' + dateParts[1] + '/' + dateParts[2];

    const payee = lineArr[4];

    const memo = lineArr[10];

    let amount = lineArr[3].replace(',', '.');
    amount = parseFloat(amount);

    let outflow = 0;
    let inflow = 0;

    if (amount > 0) {
        inflow = amount;
    } else {
        outflow = -1 * amount;
    }

    const payment = {
        date: date,
        payee: payee,
        memo: '"' + memo + '"',
        outflow: outflow,
        inflow: inflow,
    };

    return payment;
}

module.exports = parseLine;
