export { DebugPageProjector }

/**
 * PageProjectorType is responsible to project a PageModelType's content to the DOM.
 * A PageProjectorType binds itself to the DOM when the Page is activated.
 * A PageProjectorType observes the PageModelType via a PageControllerType.
 *
 * @typedef PageProjectorType
 */

/**
 * A constructor for a PageProjectorType.
 *
 * @constructor
 * @param { !NavigationControllerType } navigationController - the navigationController that controls the navigation we want to debug. Mandatory.
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const DebugPageProjector = (navigationController, pageController, pinToElement) => {
    const pageWrapper    = pinToElement;
    const contentWrapper = document.createElement('div');


    const debugTable      = document.createElement('table');
    debugTable.id         = 'debug-table';
    const thead           = document.createElement('thead');
    const tbody           = document.createElement('tbody');
    const bubble          = document.createElement('div');
    bubble.classList.add('closed-debug-bubble');
    bubble.onclick = () => contentWrapper.classList.toggle('open');
    const headerRow       = document.createElement('tr');
    const nameHeader      = document.createElement('th');
    nameHeader.innerText  = 'Observable Name';
    const valueHeader     = document.createElement('th');
    valueHeader.innerText = 'Observable Value';
    thead.append(nameHeader, valueHeader);
    debugTable.append(thead, tbody);
    debugTable.append(headerRow);

    /**
     * A function that initializes the content and stores it in the pageWrapper.
     *
     * @function
     * @return { void }
     */
    const initialize = () => contentWrapper.append(debugTable, bubble);

    /**
     * A function that creates the DOM binding and initializes the page on first activation.
     *
     * @function
     * @return { void }
     */
    const projectPage = () => {
        // initialize content on first call
        if (contentWrapper.firstChild === null) {
            initialize();
        }
        // bind content to document
        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }
    };

    pageController.onValueChanged(newValue => {
        // add class for specific page styling
        contentWrapper.classList.add(newValue);
    });

    pageController.onActiveChanged(active => {
        if (active) {
            projectPage();
        }
    });

    pageController.onIconChanged(iconPath => {
       if (null !== iconPath && undefined !== iconPath) {
           bubble.innerHTML = `<img src="${iconPath}" alt="bug-icon">`;
       }
    });

    pageController.onParentChanged(parent => {
        tbody.innerHTML = '';
        if (null !== parent) {
            for (const property in parent) {
                if ((property.startsWith('get') || property.startsWith('is')) && property !== 'getPageContentControllers') {
                    let observableName = property.startsWith('get') ? property.slice(3) : property.slice(2);
                    let observableValue = eval(`parent.${property}()`);

                    try {
                        observableValue = observableValue.getHash();
                        observableName = observableName + '_Controller';
                    } catch (error) {
                        // do nothing
                    }
                    addListItem(observableName, observableValue, parent);
                } else if (property.startsWith('on') && property.endsWith('Changed')) {
                    const observableName = property.slice(2, property.length-7);
                    // todo create callback for onchange
                }
            }
            projectPage();
        }
    });

    const addListItem = (observableName, observableValue, parent) => {
        const row = document.createElement('tr');
        row.id = observableName+'-row';
        const header = document.createElement('td');
        header.id = observableName + '-row-header';
        header.innerHTML = observableName;
        const value = document.createElement('td');
        value.id = observableName + '-row-value';

        if(typeof observableValue === "boolean") {
            const toggle = document.createElement('div');
            toggle.id    = observableName + '-toggle';
            toggle.classList.add('toggle-switch');
            toggle.onclick = () => {
                if (!toggle.classList.contains('disabled')) {
                    row.querySelector('#' + observableName + '-checkbox').click();
                    toggle.classList.toggle('active');
                }
            };
            if(observableValue) {
                toggle.classList.add('active');
            }
            const toggleHead  = document.createElement('div');
            const checkbox    = document.createElement('input');
            checkbox.id       = observableName + '-checkbox';
            checkbox.classList.add('toggle-checkbox');
            checkbox.type     = 'checkbox';
            checkbox.checked  = observableValue;
            toggle.append(toggleHead);
            if (typeof eval(`parent.set${observableName}`) === 'function') {
                checkbox.onchange = e => eval(`parent.set${observableName}(e.target.checked)`);
            } else {
                toggle.classList.add('disabled');
                checkbox.disabled = true;
            }
            value.append(toggle, checkbox);
        } else {
            const input    = document.createElement('input');
            input.id       = observableName + '-input';
            input.type     = 'text';
            input.value    = observableValue;
            if (observableName.includes('_Controller')) {
                observableName = observableName.substring(0, observableName.indexOf('_Controller'));
                if (typeof eval(`parent.set${observableName}`) === 'function') {
                    input.onchange = e => eval(`parent.set${observableName}(navigationController.getPageController(e.target.value))`);
                } else {
                    input.disabled = true;
                }
                value.append(input);
            } else {
                if (typeof eval(`parent.set${observableName}`) === 'function') {
                    input.onchange = e => eval(`parent.set${observableName}(e.target.value)`);
                } else {
                    input.disabled = true;
                }
                value.append(input);
            }
        }

        row.append(header);
        row.append(value);
        tbody.append(row);
    }
};

