const { bot } = require('./config.js');
const { jira } = require('./config.js');
const axios = require('axios/index');

const auth = {
	auth: {
		username: jira.login,
		password: jira.token,
	},
};

let hypotheticalDuty;
let arrTestersObj = [];

arrTestersObj[0] = {
	telegaName: '@stan61rus',
	name: 'костя',
	onVacation: false,
	isDone: false,
};
arrTestersObj[1] = {
	telegaName: '@Даниил',
	name: 'даня',
	onVacation: false,
	isDone: false,
};
arrTestersObj[2] = {
	telegaName: '@Денис',
	name: 'денис',
	onVacation: false,
	isDone: false,
};
arrTestersObj[3] = {
	telegaName: '@matbat',
	name: 'вика',
	onVacation: false,
	isDone: false,
};
arrTestersObj[4] = {
	telegaName: '@iEclisse',
	name: 'дима',
	onVacation: false,
	isDone: false,
};

async function jiraData() {
	const url = 'https://jira.uid.me/rest/api/2/issue/ukit-11200';
	const res = await axios.get(url, { ...auth });
	console.log(res.data.key);
}

function reset(arrTestersObj) {
	// перезатирает isDone, когда все отдежурили
	if (arrTestersObj.every(obj => obj.isDone)) {
		arrTestersObj.forEach(o => (o.isDone = false));
	}
}

function rotator(arrTestersObj) {
	// находит первого свободного тестировщика (того, кто еще не дежурил и не в отпуске)
	let switcher = arrTestersObj.find(
		obj => obj.isDone === false && obj.onVacation === false
	);
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
	testerObj.onVacation = true;
	return testerObj;
}

function on(testerObj) {
	// убирает флаг отпуска
	testerObj.onVacation = false;
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
				[
					{
						text: 'check',
						callback_data: 'check',
					},
					{
						text: 'Запустить автотесты на 32',
						callback_data: 'testsStart',
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
		if (query.data === 'check') {
			jiraData();
		}
		if (query.data === 'testsStart') {
			bot.sendMessage(
				query.message.chat.id,
				'/functionalTest regression ulight32.uid.me'
			);
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
