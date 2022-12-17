import { dom } from "../../kolibri/util/dom.js";

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
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @param { String } contentFilePath - the path to the static html content relative to index.html! Can be null.
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const DebugPageProjector = (pageController, pinToElement, contentFilePath) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");

    const debugTable = document.createElement('table');
    debugTable.id = 'debug-table';
    const headerRow = document.createElement('tr');
    const nameHeader = document.createElement('th');
    nameHeader.innerText = 'Observable Name';
    const valueHeader = document.createElement('th');
    valueHeader.innerText = 'Observable Value';
    debugTable.append(nameHeader, valueHeader);
    debugTable.append(headerRow);

    /**
     * A function that initializes the content and stores it in the pageWrapper.
     *
     * @function
     * @return { void }
     */
    const initialize = () => {
        contentWrapper.append(debugTable);
    };

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

    pageController.onParentChanged(parent => {
        if (null !== parent) {
            for (const property in parent) {
                if (property.startsWith('get') || property.startsWith('is')) {
                    const observableName = property.startsWith('get') ? property.slice(3) : property.slice(2);
                    let observableValue = eval(`parent.${property}()`);
                    try {
                        observableValue = observableValue.getHash();
                    } catch (error) {
                        eval(`parent.${property}()`);
                    }
                    addListItem(observableName, observableValue);
                }
            }
            projectPage();
        }
    });

    const addListItem = (observableName, observableValue) => {
        let row = debugTable.querySelector('#' + observableName + '-row');
        if (null !== row) {
            const header = row.querySelector('#' +observableName + '-row-header');
            const value = row.querySelector('#' +observableName + '-row-value');
            header.innerHTML = observableName;
            value.innerHTML = observableValue;
        } else {
            row = document.createElement('tr');
            row.id = observableName+'-row';
            const header = document.createElement('td');
            header.id = observableName + '-row-header';
            header.innerHTML = observableName;
            const value = document.createElement('td');
            value.id = observableName + '-row-value';
            value.innerHTML = observableValue;
            row.append(header);
            row.append(value);
            debugTable.append(row);
        }
    }
};

