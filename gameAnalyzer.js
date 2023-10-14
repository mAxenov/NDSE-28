const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv));

const logFilePath = argv.argv._[0] || 'log.txt';

fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
    }

    const logs = data.split('\n').filter((log) => log.trim() !== ''); // Разбиваем лог на строки

    const totalGames = logs.length;
    let wins = 0;
    let losses = 0;

    logs.forEach((log) => {
        if (log.includes('Победа')) {
            wins++;
        } else if (log.includes('Поражение')) {
            losses++;
        }
    });

    const winPercentage = ((wins / totalGames) * 100).toFixed(2);

    console.log('Общее количество партий:', totalGames);
    console.log('Количество выигранных партий:', wins);
    console.log('Количество проигранных партий:', losses);
    console.log('Процентное соотношение выигранных партий:', winPercentage, '%');
});