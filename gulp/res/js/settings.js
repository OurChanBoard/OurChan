/* globals modal themes codeThemes */
window.addEventListener('DOMContentLoaded', () => {

	// Remove nojs class from html element if JavaScript is loaded
	document.documentElement.classList.remove('no-js');

	let settingsModal;
	let settingsBg;

	// Exposes themes to window for noJS selector
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

	// handles settings button click when javascript is enabled
	const settings = document.getElementById('settings');
	if (settings) { //can be false if we are in minimal view
		settings.onclick = (e) => {
			e.preventDefault();
			openSettings();
			return false;
		};
	}

	// Hide all nojs settings elements if js is enabled
	// includes the checkbox, the nojs settings elements, etc
	const nojsElements = document.querySelectorAll('.modal-nojs, .modal-bg-nojs, #theme-settings, .theme-modal-bg, #settings-modal-bg, #settings-toggle, .nojs-only, label[for="settings-toggle"]');
	nojsElements.forEach(element => {
		if (element) {
			element.style.display = 'none';
			// Apply additional hiding techniques for checkboxes
			if (element.classList.contains('hidden-checkbox') || element.id === 'settings-toggle') {
				element.style.position = 'absolute';
				element.style.opacity = '0';
				element.style.width = '0';
				element.style.height = '0';
				element.style.overflow = 'hidden';
				element.style.visibility = 'hidden';
				element.style.pointerEvents = 'none';
				element.style.left = '-9999px';
			}
		}
	});
	
	// Ensure the settings toggle is unchecked by default when JS is enabled
	const settingsToggle = document.getElementById('settings-toggle');
	if (settingsToggle) {
		settingsToggle.checked = false;
	}

	window.dispatchEvent(new CustomEvent('settingsReady'));

});
