const {google} = require('googleapis');
const keys = require('./keys.json');

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

let dataArr;
const iCounter = 0;
let jCounter = 0;

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);


client.authorize(function(err,token){
    if (err){
        console.log(err);
        return;
    } else {
        console.log('Connected!');
        gsrun(client);
    }
});

async function gsrun(cl){
    const gsapi = google.sheets({version:'v4', auth: cl});

    const opt = {
        spreadsheetId: '1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q', // таблица
        range: 'test!B1:B5' // рендж по которому читаем дежурных
    };

   let data = await gsapi.spreadsheets.values.get(opt);
   dataArr = data.data.values;
 /*  newDataArr = dataArr.map(function(r){
    r.push(r[0] + '-' + r[1]);
    return r;
   });

   const UPopt = {
    spreadsheetId: '1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q',
    range: 'test!E2',
    valueInputOption: 'USER_ENTERED',
    resource: {values: newDataArr}
};

let res = await gsapi.spreadsheets.values.update(UPopt);


   console.log(res);*/
}

function whoIsOnDuty(name) { // преобразовывает имена из гугол таблицы в имя пользователя телеги
    switch (name) {
        case 'Костя':
          nik = '@stan61rus';
          break;
        case 'Даниил':
            nik = '@Даниил';
            break;
        case 'Денис':
            nik = '@Денис';
          break;
        case 'Вика':
            nik = '@matbat';
          break;
        case 'Дима':
            nik = '@iEclisse';
           break;
        default:
            nik = 'Человека нет';
      }
      return nik;
  }

function Navigation(iCount) {
    bot.onText(/\/run/, msg =>{
  const chatID = msg.chat.id

  bot.sendMessage(chatID, whoIsOnDuty(dataArr[iCount][0]) + ' время регрессов' , {
      reply_markup: {
          inline_keyboard: [
              [{
                                 
                  text: 'Поменяться',
                  callback_data: 'change'
                   },
                {
                    text: 'Подтвердить',
                    callback_data: 'confirm'
                }],
              [{
                  text: 'Ссылка на wiki',
                  url: 'https://gitlab.ukit.space/QA/wiki/wikis/home#%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B'

              },{
                  text: 'Таблица релизов',
                  url: 'https://docs.google.com/spreadsheets/d/15OStYlt-2gQVzrVaTKfeJ3Ym98TysiHf6H-PxXT0TNs/edit#gid=0'
              }]
          ]
      }
  })
  bot.on('callback_query', query => {
    if(query.data === 'change'){
        bot.sendMessage(msg.chat.id, 'ок');
        Navigation(iCounter);
    }
})
})
}


Navigation(iCounter+3);


/*bot.on('callback_query', query => {
    if(query.data === 'change'){
        Navigation(iCounter + 1);
    }
})*/