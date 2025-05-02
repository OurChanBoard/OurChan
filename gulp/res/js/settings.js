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

	// Get the no-JS settings panel
	const themeSettings = document.getElementById('theme-settings');
	const themeModalBg = document.querySelector('.theme-modal-bg');
	
	// Ensure the no-JS settings panel is hidden when JavaScript is enabled
	if (themeSettings) {
		themeSettings.style.display = 'none';
	}
	
	// Set up close button functionality for the no-JS settings panel
	// Get all close buttons in the theme settings panel
	const closeButtons = themeSettings ? themeSettings.querySelectorAll('.close') : [];
	
	// Add click event listener to close buttons
	closeButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.hash = '';
		});
	});

	// Add click event listener to modal background
	if (themeModalBg) {
		themeModalBg.addEventListener('click', () => {
			window.location.hash = '';
		});
	}

	// Handle settings button click in JS mode
	const settings = document.getElementById('settings');
	if (settings) { //can be false if we are in minimal view
		settings.onclick = (e) => {
			e.preventDefault();
			openSettings();
			return false;
		};
	}

	window.dispatchEvent(new CustomEvent('settingsReady'));

});
