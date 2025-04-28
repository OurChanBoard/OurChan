/* globals setLocalStorage */
let customCSSString = localStorage.getItem('customcss');
let disableBoardCss = localStorage.getItem('disableboardcss') == 'true';

// no-JS theme selector
const addNoJsThemeSelector = () => {
	const settingsContainer = document.querySelector('.settings-container');
	if (!settingsContainer) return;
	
	const noJsSelector = document.createElement('div');
	noJsSelector.className = 'no-js-theme-selector';
	noJsSelector.innerHTML = `
		<form id="no-js-theme-form" class="theme-form">
			<div class="theme-select-group">
				<label for="no-js-theme">Theme:</label>
				<select name="theme" id="no-js-theme">
					<option value="default">Default</option>
					${window.themes.map(theme => `<option value="${theme}">${theme}</option>`).join('')}
				</select>
			</div>
			<div class="theme-select-group">
				<label for="no-js-codetheme">Code Theme:</label>
				<select name="codetheme" id="no-js-codetheme">
					<option value="default">Default</option>
					${window.codeThemes.map(theme => `<option value="${theme}">${theme}</option>`).join('')}
				</select>
			</div>
			<button type="submit">Apply Theme</button>
		</form>
	`;
	
	// hide when JS is enabled
	if (window.navigator.javaEnabled !== false) {
		noJsSelector.style.display = 'none';
	}
	
	settingsContainer.appendChild(noJsSelector);
	
	// handle form submission
	const form = noJsSelector.querySelector('#no-js-theme-form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const theme = form.querySelector('#no-js-theme').value;
		const codeTheme = form.querySelector('#no-js-codetheme').value;
		
		// use existing theme change functions
		if (theme !== 'default') {
			setLocalStorage('theme', theme);
			changeTheme('theme');
		}
		if (codeTheme !== 'default') {
			setLocalStorage('codetheme', codeTheme);
			changeTheme('codetheme');
		}
	});
};

window.addEventListener('settingsReady', function() {
	addNoJsThemeSelector();
	
	//for main theme
	const themePicker = document.getElementById('theme-setting');
	themePicker.value = localStorage.getItem('theme');
	themePicker.addEventListener('change', () => {
		setLocalStorage('theme', themePicker.value);
		changeTheme('theme');
	}, false);

	//for code theme
	const codeThemePicker = document.getElementById('codetheme-setting');
	codeThemePicker.value = localStorage.getItem('codetheme');
	codeThemePicker.addEventListener('change', () => {
		setLocalStorage('codetheme', codeThemePicker.value);
		changeTheme('codetheme');
	}, false);

	//custom CSS for users
	const customCSSSetting = document.getElementById('customcss-setting');
	const editCustomCSS = () => {
		customCSSString = customCSSSetting.value;
		console.log('editing custom CSS', customCSSString.length);
		setLocalStorage('customcss', customCSSString); //what if this gets too long?
		changeTheme('customcss');
	};
	customCSSSetting.value = customCSSString;
	customCSSSetting.addEventListener('input', editCustomCSS, false);

	//for main theme
	const disableBoardCssInput = document.getElementById('disableboardcss-setting');
	disableBoardCssInput.addEventListener('change', () => {
		disableBoardCss = !disableBoardCss;
		setLocalStorage('disableboardcss', disableBoardCss);
		console.log('toggling disable board custom css', disableBoardCss);
		toggleBoardCss();
	}, false);
	disableBoardCssInput.checked = localStorage.getItem('disableboardcss') == 'true';

});

const customCSSLink = document.createElement('style');
customCSSLink.rel = 'stylesheet';
customCSSLink.id = 'customcss';
document.head.appendChild(customCSSLink);

toggleBoardCss();

function toggleBoardCss() {
	const boardCssLink = document.getElementById('board-customcss');
	if (boardCssLink) {
		if (disableBoardCss) {
			boardCssLink.setAttribute('media', 'screen and (max-width: 1px)');
		} else {
			boardCssLink.removeAttribute('media');
		}
	}
}

function changeTheme(type) {
	switch (type) {
		case 'theme':
		case 'codetheme': {
			const theme = localStorage.getItem(type);
			let tempLink = document.getElementById(`custom${type}`);
			let defaultLink = document.getElementById(type);
			if (theme === 'default' || theme === defaultLink.dataset.theme) {
				defaultLink.rel = 'stylesheet';
				setTimeout(() => {
					tempLink && tempLink.remove();
				}, 100);
			} else {
				//use path and try to fetch from localstorage
				const path = `/css/${type}s/${theme}.css`;
				let css = localStorage.getItem(path);
				if (!tempLink) {
					tempLink = document.createElement('style');
					document.head.appendChild(tempLink);
				}
				if (css) {
					tempLink.innerHTML = css; //set as inline style temporarily
				}
				defaultLink.rel = ''; //disable default theme
				const themeLink = document.createElement('link');
				themeLink.rel = 'stylesheet';
				themeLink.id = `custom${type}`;
				themeLink.onload = function() {
					css = '';
					const rulesKey = themeLink.sheet.rules != null ? 'rules' : 'cssRules';
					for (let i = 0; i < themeLink.sheet[rulesKey].length; i++) {
						css += themeLink.sheet[rulesKey][i].cssText; //add all the rules to the css
					}
					//update localstorage with latest version
					setLocalStorage(path, css);
					tempLink.innerHTML = css;
					//remove temp inline style since we dont need it anymore
					tempLink.remove();
				};
				themeLink.href = path;
				document.head.appendChild(themeLink);
			}
			break;
		}
		case 'customcss':
			customCSSLink.innerHTML = localStorage.getItem('customcss');
			break;
	}
}
changeTheme('theme');
changeTheme('codetheme');
changeTheme('customcss');
