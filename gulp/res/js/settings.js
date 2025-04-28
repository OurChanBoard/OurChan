/* globals modal themes codeThemes */
window.addEventListener('DOMContentLoaded', () => {

	let settingsModal;
	let settingsBg;

	// Expose themes to window for no-JS selector
	window.themes = themes;
	window.codeThemes = codeThemes;

	const hideSettings = () => {
		settingsModal.style.display = 'none';
		settingsBg.style.display = 'none';
	};

	const openSettings = () => {
		settingsModal.style.display = 'unset';
		settingsBg.style.display = 'unset';
	};

	const modalHtml = modal({
		modal: {
			title: 'Settings',
			settings: {
				themes,
				codeThemes,
			},
			hidden: true,
		}
	});

	document.body.insertAdjacentHTML('afterbegin', modalHtml);
	settingsBg = document.getElementsByClassName('modal-bg')[0];
	settingsModal = document.getElementsByClassName('modal')[0];

	settingsBg.onclick = hideSettings;
	settingsModal.getElementsByClassName('close')[0].onclick = hideSettings;

	const settings = document.getElementById('settings');
	if (settings) { //can be false if we are in minimal view
		settings.onclick = openSettings;
	}

	// Hide the no-JS settings button when JavaScript is enabled
	const noJsSettingsButton = document.getElementById('no-js-settings');
	if (noJsSettingsButton) {
		noJsSettingsButton.style.display = 'none';
	}

	window.dispatchEvent(new CustomEvent('settingsReady'));

});
