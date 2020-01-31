const keys = require('./token.js');
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

const jira = {
	login: 'regDutyBot',
	token: keys.token
};

module.exports = {bot, jira}
