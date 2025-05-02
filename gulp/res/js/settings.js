/* globals modal themes codeThemes */
window.addEventListener('DOMContentLoaded', () => {

	// Remove no-js class from html element when JavaScript is loaded
	document.documentElement.classList.remove('no-js');

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

	// Handle settings button click in JS mode
	const settings = document.getElementById('settings');
	if (settings) { //can be false if we are in minimal view
		settings.onclick = (e) => {
			e.preventDefault();
			openSettings();
			return false;
		};
	}

	// Make sure any lingering no-JS settings panels are hidden
	// Clean up any no-JS related elements to avoid conflicts
	const elementsToHide = [
		'nojs-settings-modal',
		'nojs-settings-modal-bg',
		'nojs-settings'
	];
	
	elementsToHide.forEach(id => {
		const element = document.getElementById(id);
		if (element) {
			element.style.display = 'none';
		}
	});

	window.dispatchEvent(new CustomEvent('settingsReady'));

});
