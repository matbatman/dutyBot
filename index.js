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
	// перезатирает isDone, когда все отдежурили
	if (arrTestersObj.every(obj => obj.isDone)) {
		arrTestersObj.forEach(o => (o.isDone = false));
	}
}

function rotator(arrTestersObj) {
	// находит первого свободного тестировщика (того, кто еще не дежурил)
	let switcher = arrTestersObj.find(obj => obj.isDone === false);
	return switcher;
}

function onDuty(testerObj) {
	// проставляет флаг дежурства
	testerObj.isDone = true;
	return testerObj;
}

function searchByName(chatID, name) {
	// ищет по совпадению имени дежурного
	if (arrTestersObj.find(obj => obj.name === name)) {
		let faundedOb = arrTestersObj.find(obj => obj.name === name);
		return faundedOb;
	} else {
		bot.sendMessage(chatID, 'имя не найдено');
	}
}

function off(testerObj) {
	// проставляет флаг отпуска
	testerObj.isDone = -1;
	return testerObj;
}

function on(testerObj) {
	// убирает флаг отпуска
	testerObj.isDone = false;
	return testerObj;
}

function navigation(chatID, telegaId) {
	// тегалка с кнопочками
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
		// прослушка на кнопку подтверждение
		if (query.data === 'confirm') {
			onDuty(hypotheticalDuty);
		}
	});
}

bot.onText(/\/run/, msg => {
	// ручной запуск поиска дежурного
	reset(arrTestersObj);
	hypotheticalDuty = rotator(arrTestersObj);
	navigation(msg.chat.id, hypotheticalDuty.telegaName);
});

bot.onText(/\/switch/, msg => {
	// ручка для смены дежурного на определенного человека
	let name = msg.text.slice(8); // забираем имя
	let tag = searchByName(msg.chat.id, name);
	navigation(msg.chat.id, tag.telegaName);
});

bot.onText(/\/off/, msg => {
	// ручка отпуска
	let name = msg.text.slice(5); // забираем имя
	let PersonOnVacation = searchByName(msg.chat.id, name);
	off(PersonOnVacation);
});

bot.onText(/\/on/, msg => {
	// ручка выхода из отпуска
	let name = msg.text.slice(4); // забираем имя
	let PersonOffVacation = searchByName(msg.chat.id, name);
	on(PersonOffVacation);
});

bot.onText(/\/table/, msg => {});
