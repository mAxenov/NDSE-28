const yargs = require('yargs');

// Функция для форматирования даты в ISO
function formatISODate(date) {
    return date.toISOString().split('T')[0];
}

// Определение команды "current"
yargs.command('current', 'Получение текущей даты и времени', (yargs) => {
    return yargs.options({
        'year': {
            alias: 'y',
            description: 'Текущий год',
            boolean: true,
        },
        'month': {
            alias: 'm',
            description: 'Текущий месяц',
            boolean: true,
        },
        'date': {
            alias: 'd',
            description: 'Дата в календарном месяце',
            boolean: true,
        },
    });
}, (argv) => {
    const now = new Date();

    if (argv.year) {
        console.log(now.getFullYear());
    } else if (argv.month) {
        console.log(formatISODate(now).slice(0, 7));
    } else if (argv.date) {
        console.log(formatISODate(now));
    } else {
        console.log(now.toISOString());
    }
});

// Определение команды "add"
yargs.command('add', 'Добавление дней, месяцев или лет к текущей дате', (yargs) => {
    return yargs.options({
        'days': {
            alias: 'd',
            description: 'Количество дней для добавления',
            type: 'number',
        },
        'months': {
            alias: 'M',
            description: 'Количество месяцев для добавления',
            type: 'number',
        },
        'years': {
            alias: 'Y',
            description: 'Количество лет для добавления',
            type: 'number',
        },
    });
}, (argv) => {
    const now = new Date();
    console.log(argv);
    if (argv.days) {
        now.setDate(now.getDate() + argv.days);
    }

    if (argv.months) {
        now.setMonth(now.getMonth() + argv.months);
    }

    if (argv.years) {
        now.setFullYear(now.getFullYear() + argv.years);
    }

    console.log(now.toISOString());
});

// Определение команды "sub"
yargs.command('sub', 'Вычитание дней, месяцев или лет из текущей даты', (yargs) => {
    return yargs.options({
        'days': {
            alias: 'd',
            description: 'Количество дней для вычитания',
            type: 'number',
        },
        'months': {
            alias: 'M',
            description: 'Количество месяцев для вычитания',
            type: 'number',
        },
        'years': {
            alias: 'Y',
            description: 'Количество лет для вычитания',
            type: 'number',
        },
    });
}, (argv) => {
    const now = new Date();

    if (argv.days) {
        now.setDate(now.getDate() - argv.days);
    }

    if (argv.months) {
        now.setMonth(now.getMonth() - argv.months);
    }

    if (argv.years) {
        now.setFullYear(now.getFullYear() - argv.years);
    }

    console.log(now.toISOString());
});

yargs.argv;