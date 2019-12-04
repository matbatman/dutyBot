const keys = require('./token.js');
let testers = ['@stan61rus', '@Даниил', '@Денис', '@matbat', '@iEclisse'];

/*function Tester(telegaName, isDone)
{
    this.telegaName = telegaName;
    this.isDone = isDone;
}

let tes0 = new Tester(testers[0],0); думаю думаю
let tes1 = new Tester(testers[1],0);
let tes2 = new Tester(testers[2],0);*/

let arrTestersObj = [];

arrTestersObj[0] = {
    telegaName: '@stan61rus',
    isDone: 0,
}
arrTestersObj[1] = {
    telegaName: '@Даниил',
    isDone: 0,
}
arrTestersObj[2] = {
    telegaName: '@Денис',
    isDone: 0,
}
arrTestersObj[3] = {
    telegaName: '@matbat',
    isDone: 0,
}
arrTestersObj[4] = {
    telegaName: '@iEclisse',
    isDone: 0,
}

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(keys.token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

function Rotation(tester)
{

}

function onDuty(testerObj)
{
    testerObj.isDone = 1;
    console.log(testerObj);
}

function Navigation(chatID){
    bot.sendMessage(chatID, 'Навигация', {
        reply_markup: {
            inline_keyboard:[
                [
                    {
                        text: 'Подтвердить',
                        callback_data: 'confirm'
                    },
                    {
                        text: 'Поменяться',
                        callback_data: 'switch'
                    }
                ],
                [
                    {
                        text: 'WIKI',
                        url: 'https://gitlab.ukit.space/QA/wiki/wikis/home#%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B'
                    },
                    {
                        text: 'Таблица релизов',
                        url: 'https://docs.google.com/spreadsheets/d/1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q/edit#gid=0'
                    }
                ]
            ]
        }
    })

    bot.on('callback_query', query => {
        if(query.data === 'switch') {
         
        }
    })

    bot.on('callback_query', query => {
        if(query.data === 'confirm') {
        onDuty(arrTestersObj[0]);
        }     
    })
}

bot.onText(/\/run/, msg => {
    bot.sendMessage(msg.chat.id, 'OK');
    // сюда ротатор
})