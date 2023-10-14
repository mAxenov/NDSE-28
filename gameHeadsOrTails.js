const fs = require('fs');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv));

const logFilePath = argv.argv._[0] || 'log.txt';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function playGame() {
    const randomNumber = Math.floor(Math.random() * 2) + 1; // генерируем случайное число от 1 до 2

    rl.question('Угадайте число (1 или 2): ', (answer) => {
        const userAnswer = parseInt(answer);

        if (userAnswer === 1 || userAnswer === 2) {
            const result = userAnswer === randomNumber ? 'Победа!' : 'Поражение!';
            const logData = `Пользователь выбрал ${userAnswer}. Загаданное число было ${randomNumber}. Результат: ${result}\n`;

            fs.appendFile(logFilePath, logData, (err) => {
                if (err) throw err;
                console.log(result);
                rl.question('Сыграть ещё? (y/n): ', (again) => {
                    if (again.toLowerCase() === 'y') {
                        playGame();
                    } else {
                        console.log('Спасибо за игру!');
                        rl.close();
                    }
                });
            });
        } else {
            console.log('Пожалуйста, введите число 1 или 2.');
            playGame();
        }
    });
}

playGame();