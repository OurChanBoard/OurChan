/* globals modal themes codeThemes */
window.addEventListener('DOMContentLoaded', () => {

	let settingsModal;
	let settingsBg;

	// Expose themes to window for no-JS selector
	window.themes = themes;
	window.codeThemes = codeThemes;

	const hideSettings = () => {
		if (settingsModal && settingsBg) {
			settingsModal.style.display = 'none';
			settingsBg.style.display = 'none';
		}
	};

	const openSettings = () => {
		if (!settingsModal || !settingsBg) {
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
		}
		
		settingsModal.style.display = 'unset';
		settingsBg.style.display = 'unset';
	};

	const settings = document.getElementById('settings');
	if (settings) { //can be false if we are in minimal view
		settings.onclick = (e) => {
			e.preventDefault();
			openSettings();
		};
	}

	// Hide the no-JS settings panel when JavaScript is enabled
	const noJsSettingsPanel = document.getElementById('theme-settings');
	if (noJsSettingsPanel) {
		noJsSettingsPanel.style.display = 'none';
	}

	window.dispatchEvent(new CustomEvent('settingsReady'));

});
