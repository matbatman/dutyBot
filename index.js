const { bot } = require('./config.js');

let hypotheticalDuty;
let arrTestersObj = [];

arrTestersObj[0] = {
	telegaName: '@stan61rus',
	name: 'костя',
	isDone: false,
};
arrTestersObj[1] = {
	telegaName: '@Даниил',
	name: 'даня',
	isDone: false,
};
arrTestersObj[2] = {
	telegaName: '@Денис',
	name: 'денис',
	isDone: false,
};
arrTestersObj[3] = {
	telegaName: '@matbat',
	name: 'вика',
	isDone: false,
};
arrTestersObj[4] = {
	telegaName: '@iEclisse',
	name: 'дима',
	isDone: false,
};

function reset(arrTestersObj) {
	if (
		arrTestersObj[0].isDone &&
		arrTestersObj[1].isDone &&
		arrTestersObj[2].isDone &&
		arrTestersObj[3].isDone &&
		arrTestersObj[4].isDone
	) {
		// слишком за уши — нада что то норм
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
	return testerObj;
}

function off(testerObj) {
	testerObj.isDone = -1;
	return testerObj;
}

function on(testerObj) {
	testerObj.isDone = false;
	return testerObj;
}

function switcher(chatID, firstLetterOfName) {
	switch (firstLetterOfName) {
		case 'костя':
			navigation(chatID, arrTestersObj[0].telegaName);
			return 'success';

		case 'даниил':
			navigation(chatID, arrTestersObj[1].telegaName);
			return 'success';

		case 'денис':
			navigation(chatID, arrTestersObj[2].telegaName);
			return 'success';

		case 'вика':
			navigation(chatID, arrTestersObj[3].telegaName);
			return 'success';

		case 'дима':
			navigation(chatID, arrTestersObj[4].telegaName);
			return 'success';

		default:
			bot.sendMessage(chatID, 'имя не найдено');
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
	switcher(msg.chat.id, name);
});

bot.onText(/\/off/, msg => {
	let name = msg.text.slice(8); // забираем все сообщение и режем команду
	off();
});

bot.onText(/\/table/, msg => {});
