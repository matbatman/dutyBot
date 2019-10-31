const {google} = require('googleapis');
const keys = require('./keys.json');
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err,token){
    if(err){
        console.log(err);
        return;
    } else {
        console.log('Connected to Sheets!')
    }
});

async function writeToTheSheets(cl, currentTester){
    const gsapi = google.sheets({version:'v4', auth: cl});
    const updateByTesretName = {
        spreadsheetId: '1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q',
        range:'test!B3',
        valueInputOption: 'USER_ENTERED',
        resource: {values: currentTester}
    };
    let res = await gsapi.spreadsheets.values.update(updateByTesretName);
    console.log(res);
}


const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '1026332914:AAGiTL91XNW6OKyf1qWTzXuLkxG68bedJX4';
const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

const testers = ['@stan61rus', '@Даниил', '@Денис', '@matbat', '@iEclisse'];
let TelegramtesterID = 0;


writeToTheSheets(client, testers[0]);



function callOnDuty(chatID, tester){
    bot.sendMessage(chatID, tester +' пора регрессировать');
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
        if(query.data === 'confirm') {
            bot.sendMessage('ok');
            
        }
    })
}

bot.onText(/\/run/, msg => {
    callOnDuty(msg.chat.id, testers[TelegramtesterID]);
    if(TelegramtesterID === 4) {
        TelegramtesterID = 0;
    } else {
        TelegramtesterID +=1;
    }
    Navigation(msg.chat.id);
})