import {dom} from "../../kolibri/util/dom.js";

export { PageNotFoundProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @param { !HTMLDivElement } pinToElement
 * @returns { PageProjectorType }
 */

const PageNotFoundProjector = (pageController, pinToElement) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement('div');

    const initialize = () => {
        const page = dom(`
            <div id="content-wrapper">
                <h1>404</h1>
                <div class="message-wrapper">
                    <p>Page not found</p>
                    <p>Please contact your local admin!</p>
                </div>
            </div>
        `);

        contentWrapper.appendChild(...page);

        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }
    };

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

    return {
        projectPage
    }
};

