#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv));

const commandCurrent = (argv) => {
    if (argv.years) {
        console.log(new Date().getFullYear());
    }
    if (argv.months) {
        console.log(new Date().getMonth() + 1);
    }
    if (argv.days) {
        console.log(new Date().getDate());
    }

    if (!argv.years && !argv.months && !argv.days) {
        console.log(new Date().toISOString());
    }
}

const commandAdd = (argv) => {
    let now = new Date();
    if (argv.years) {
        now.setFullYear(now.getFullYear() + argv.years)
    }
    if (argv.months) {
        now.setMonth(now.getMonth() + argv.months);
    }
    if (argv.days) {
        now.setDate(now.getDate() + argv.days);
    }
    console.log(now.toISOString());
}

const commandSub = (argv) => {
    let now = new Date();
    if (argv.years) {
        now.setFullYear(now.getFullYear() - argv.years)
    }
    if (argv.months) {
        now.setMonth(now.getMonth() - argv.months);
    }
    if (argv.days) {
        now.setDate(now.getDate() - argv.days);
    }
    console.log(now.toISOString());
}

// Команда получения дня, месяца или года из текущей даты
argv.command('current', 'get current date', (yargs) => {
    yargs.options({
        'days': {
            alias: 'd',
            description: 'Current year',
            type: 'bollean',
        },
        'months': {
            alias: 'm',
            description: 'Current month',
            type: 'bollean',
        },
        'years': {
            alias: 'y',
            description: 'Date in calendar month',
            type: 'bollean',
        },
    });
},
    commandCurrent
);

// Команда добавление дня, месяца или года из текущей даты
argv.command('add', 'get date in future', (yargs) => {
    yargs.options({
        'days': {
            alias: 'd',
            description: 'Number of days to add',
            type: 'number',
        },
        'months': {
            alias: 'm',
            description: 'Number of months to add',
            type: 'number',
        },
        'years': {
            alias: 'y',
            description: 'Number of years to add',
            type: 'number',
        },
    });
},
    commandAdd
);

// Команда вычитыния дня, месяца или года из текущей даты
argv.command('sub', 'get date in future', (yargs) => {
    yargs.options({
        'days': {
            alias: 'd',
            description: 'Number of days to sub',
            type: 'number',
        },
        'months': {
            alias: 'm',
            description: 'Number of months to sub',
            type: 'number',
        },
        'years': {
            alias: 'y',
            description: 'Number of years to sub',
            type: 'number',
        },
    });
},
    commandSub
)

argv.example('cmd-date add -d 1', 'add date in future')
    .example('cmd-date sub -d 1', 'sub date in future')
    .help()
    .argv;


