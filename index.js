const http = require('http');

const accessKey = process.env.accessKey;
const city = process.argv[2] || 'New York';
const url = `${process.env.url}?access_key=${accessKey}&query=${city}`;

http.get(url, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
        console.error(`Status Code: ${statusCode}`);
        return;
    }

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const weatherData = JSON.parse(data);
        const { forecast } = weatherData;
        let result = `Weather forecast in ${city}`
        for (let element in forecast) {
            result += `${forecast[element].date}: mintemp: ${forecast[element].mintemp} maxtemp: ${forecast[element].maxtemp} `
        }
        console.log(result);
    });
}).on('error', (err) => {
    console.err(`Problem with respons: ${err.message}`);
});