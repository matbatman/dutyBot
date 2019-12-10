const keys = require('./token.js');

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

function reset(arrTestersObj) {
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

function rotator(arrTestersObj) {
	for (let i = 0; i < arrTestersObj.length; i++) {
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

function switcer(firstLetterOfName) {
	switch (firstLetterOfName) {
		case 'костя':
			onDuty(arrTestersObj[0]);
			return 'success';

		case 'даниил':
			onDuty(arrTestersObj[1]);
			return 'success';

		case 'денис':
			onDuty(arrTestersObj[2]);
			return 'success';

		case 'вика':
			onDuty(arrTestersObj[3]);
			return 'success';

		case 'дима':
			onDuty(arrTestersObj[4]);
			return 'success';

		default:
			return 'name not found';
	}
}

function navigation(chatID, telegaId) {
	bot.sendMessage(chatID, `Пора регрессировать ${telegaId}`, {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Подтвердить',
						callback_data: 'confirm',
					},
					{
						text: 'WIKI',
						url:
							'https://gitlab.ukit.space/QA/wiki/wikis/home#%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B',
					},
				],
			],
		},
	});

	bot.on('callback_query', query => {
		if (query.data === 'confirm') {
			onDuty(hypotheticalDuty);
		}
	});
}

bot.onText(/\/run/, msg => {
	reset(arrTestersObj);
	hypotheticalDuty = rotator(arrTestersObj);
	navigation(msg.chat.id, hypotheticalDuty.telegaName);
});

bot.onText(/\/switch/, msg => {
	let name = msg.text.slice(8); // забираем все сообщение и режем команду
	switcer(name);
});

bot.onText(/\/table/, msg => {});
