#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const minRange = 0;
const maxRange = 100;
const secretNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

console.log(`Загадано число в диапазоне от ${minRange} до ${maxRange}`);

function guessNumber() {
    rl.question('Введите число: ', (userInput) => {
        const guess = parseInt(userInput);

        if (isNaN(guess)) {
            console.log('Пожалуйста, введите числовое значение.');
            guessNumber();
        } else if (guess < minRange || guess > maxRange) {
            console.log(`Пожалуйста, введите число в диапазоне от ${minRange} до ${maxRange}.`);
            guessNumber();
        } else {
            if (guess < secretNumber) {
                console.log('Больше');
                guessNumber();
            } else if (guess > secretNumber) {
                console.log('Меньше');
                guessNumber();
            } else {
                console.log(`Отгадано число ${secretNumber}`);
                rl.close();
            }
        }
    });
}

guessNumber();