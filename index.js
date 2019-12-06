const keys = require('./token.js');

/*function Tester(telegaName, isDone)
{
    this.telegaName = telegaName;
    this.isDone = isDone;
}

let tes0 = new Tester(testers[0],0); думаю думаю
let tes1 = new Tester(testers[1],0);
let tes2 = new Tester(testers[2],0);*/

let hypotheticalDuty;
let arrTestersObj = [];

arrTestersObj[0] = {
	telegaName: '@stan61rus',
	isDone: false,
};
arrTestersObj[1] = {
	telegaName: '@Даниил',
	isDone: false,
};
arrTestersObj[2] = {
	telegaName: '@Денис',
	isDone: false,
};
arrTestersObj[3] = {
	telegaName: '@matbat',
	isDone: false,
};
arrTestersObj[4] = {
	telegaName: '@iEclisse',
	isDone: false,
};

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(keys.token, {
	polling: {
		interval: 300,
		autoStart: true,
		params: {
			timeout: 10,
		},
	},
});

function Reset(arrTestersObj) {
	if (
		arrTestersObj[0].isDone &&
		arrTestersObj[1].isDone &&
		arrTestersObj[2].isDone &&
		arrTestersObj[3].isDone &&
		arrTestersObj[4].isDone
	) {
		// слишком за уши
		for (let i = 0; i < arrTestersObj.length; i++) {
			arrTestersObj[i].isDone = false;
		}
	}
}

function Rotator(arrTestersObj) {
	for (i = 0; i < arrTestersObj.length; i++) {
		if (arrTestersObj[i].isDone == false) {
			let switcher = arrTestersObj[i];
			return switcher;
		}
	}
}

function onDuty(testerObj) {
	testerObj.isDone = true;
	console.log(testerObj);
}

function Navigation(chatID, telegaId) {
	bot.sendMessage(chatID, `Пора регрессировать ${telegaId}`, {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Подтвердить',
						callback_data: 'confirm',
					},
					{
						text: 'Поменяться',
						callback_data: 'switch',
					},
				],
				[
					{
						text: 'WIKI',
						url:
							'https://gitlab.ukit.space/QA/wiki/wikis/home#%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B',
					},
					{
						text: 'Таблица релизов',
						url:
							'https://docs.google.com/spreadsheets/d/1du1FQ4pCNV6boihRr2JeQgZiUwkwOx9OC63ex7mwc0Q/edit#gid=0',
					},
				],
			],
		},
	});

	bot.on('callback_query', query => {
		if (query.data === 'switch') {
		}
	});

	bot.on('callback_query', query => {
		if (query.data === 'confirm') {
			console.log(hypotheticalDuty);
			onDuty(hypotheticalDuty);
		}
	});
}

bot.onText(/\/run/, msg => {
	Reset(arrTestersObj);
	hypotheticalDuty = Rotator(arrTestersObj);
	console.log(hypotheticalDuty);
	Navigation(msg.chat.id, hypotheticalDuty.telegaName);
});
