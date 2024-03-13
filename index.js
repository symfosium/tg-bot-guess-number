const TelegramAPI = require('node-telegram-bot-api');
const {gameOptions,againOptions} = require('./options');
const token = '6809652230:AAEHL4dWnCNxsgk65Z4mwjHACy6pZK3Da2k';

const bot = new TelegramAPI(token, {polling: true});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен будешь ее отгадать;)');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!',gameOptions);
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие'},
            {command: '/info', description: "Получить информацию о пользователе"},
            {command: '/game', description: "Игра угадай число"}
        ])

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/4.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот MyFirstBot`);
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} and your username is ${msg.from.username}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще разок!');

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        const guessedNumber = parseInt(data);

        if (guessedNumber === chats[chatId]) {
            return await bot.sendMessage(chatId, `А ты молодец! Правильно! Это цифра ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Вдохни глубоко и попробуй еще разок! А в этот раз я заказал цифру ${chats[chatId]}`,againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(data)
    })
}

start();