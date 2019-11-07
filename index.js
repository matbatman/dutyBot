// чет мудренное с индексами - они перекрывают как то друг друга
// надо понять

const {google} = require('googleapis');
const keys = require('./keys.json');
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

let testers = ['@stan61rus', '@Даниил', '@Денис', '@matbat', '@iEclisse'];
let name;
const testerNames = {
    stan61rus: [['Костя']],
    Daniil: [['Даниил']],
    Denis: [['Денис']],
    matbat: [['Вика']],
    iEclisse: [['Дима']]
};
let counter = 1;

client.authorize(function(err,token){
    if(err){
        console.log(err);
        return;
    } else {
        console.log('Connected to Sheets!');
    }
});

async function WriteForSheets(cl, CurrentTesterTelegramID){
    const gsapi = google.sheets({version:'v4', auth: cl});

    switch (CurrentTesterTelegramID) {
        case '@stan61rus':
            name = testerNames.stan61rus;
            break;
        case '@Даниил':
            name = testerNames.Daniil;
            break;
        case '@Денис':
            name = testerNames.Denis;
            break;
        case '@matbat':
            name = testerNames.matbat;
            break;
        case '@iEclisse':
            name = testerNames.iEclisse;
            break;
        default:
            name = false;
            break;
      }
      console.log(name, '*****************');
    const updateByTesretName = {
        spreadsheetId: '1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q',
        range:`test!H${counter}`,
        valueInputOption: 'USER_ENTERED',
        resource: {values: name}
    };

    let res = await gsapi.spreadsheets.values.update(updateByTesretName);
    console.log(res);
}


const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

let TelegramtesterID = 0;

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
        if(query.data === 'switch') {
            if(TelegramtesterID === 4) {
                TelegramtesterID = 0;
            } else {
                TelegramtesterID +=1;
                callOnDuty(chatID, [testers[TelegramtesterID]]);
            }
            Navigation(chatID);
         
        }
    })

    bot.on('callback_query', query => {
        if(query.data === 'confirm') {
            WriteForSheets(client, testers[TelegramtesterID]);
            if(TelegramtesterID === 4) {
                TelegramtesterID = 0;
                counter += 1;
            } else {
                TelegramtesterID +=1;
               counter += 1; // да почему по 2 раза??????
            }
        }
        //bot.sendMessage(chatID,'ok');    разобравться почему дублируется        
    })
}

bot.onText(/\/run/, msg => {
   callOnDuty(msg.chat.id, [testers[TelegramtesterID]]);
    Navigation(msg.chat.id);
    if(TelegramtesterID === 4) {
        TelegramtesterID = 0;
       counter += 1;
    } else {
        TelegramtesterID +=1;
        counter += 1; // да почему по 2 раза??????
    }
})