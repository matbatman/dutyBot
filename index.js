const { bot } = require('./config.js');

let hypotheticalDuty;
let arrTestersObj = [];

arrTestersObj[0] = {
	telegaName: '@stan61rus',
	name: 'костя',
	isDone: true,
};
arrTestersObj[1] = {
	telegaName: '@Даниил',
	name: 'даня',
	isDone: true,
};
arrTestersObj[2] = {
	telegaName: '@Денис',
	name: 'денис',
	isDone: true,
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
	if (arrTestersObj.every(obj => obj.isDone)) {
		arrTestersObj.forEach(o => (o.isDone = false));
	}
}

function rotator(arrTestersObj) {
	let switcher = arrTestersObj.find(obj => obj.isDone === false);
	return switcher;
}

function onDuty(testerObj) {
	testerObj.isDone = true;
	return testerObj;
}

function searchByName(chatID, name) {
	if (arrTestersObj.find(obj => obj.name === name)) {
		let faundedOb = arrTestersObj.find(obj => obj.name === name);
		return faundedOb;
	} else {
		bot.sendMessage(chatID, 'имя не найдено');
	}
}

function off(testerObj) {
	testerObj.isDone = -1;
	return testerObj;
}

function on(testerObj) {
	testerObj.isDone = false;
	return testerObj;
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
	let tag = searchByName(msg.chat.id, name);
	navigation(msg.chat.id, tag.telegaName);
});

bot.onText(/\/off/, msg => {
	let name = msg.text.slice(5); // забираем все сообщение и режем команду
	let PersonOnVacation = searchByName(msg.chat.id, name);
	off(PersonOnVacation);
});

bot.onText(/\/on/, msg => {
	let name = msg.text.slice(4); // забираем все сообщение и режем команду
	let PersonOffVacation = searchByName(msg.chat.id, name);
	on(PersonOffVacation);
});

bot.onText(/\/table/, msg => {});
