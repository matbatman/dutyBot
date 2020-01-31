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
	token: '1026332914:AAGUmG3XxoHbJb-Wwg3N0CwkFD4VMrwLBKQ'
};

module.exports = {bot, jira}
