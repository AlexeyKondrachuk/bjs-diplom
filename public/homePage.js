
'use strict'

// logout
const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(response => {
		if (response.success) {
			location.reload();
		}
	});
};

// Profile

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();
const requestExchangeRates = () => {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
};

requestExchangeRates();
setInterval(requestExchangeRates, 6000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, 'Выполнено успешно');
		} else moneyManager.setMessage(response.success, response.error);
	})
};

moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, 'Выполнено успешно');
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, 'Операция прошла успешно');
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	})
};

// favorites

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, `${userName} успешно добавлен`);
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	});
};

// remove user

favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, `адрес с ID ${userId} успешно удален`);
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	});
};