import { dom } from "../../kolibri/util/dom.js";

export { HomePageProjector }
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

const HomePageProjector = (pageController, pinToElement) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");

    const initialize = () => {
        const page = dom(`
            <div id="content-wrapper">
                <h1>Home</h1>
                <div class="message-wrapper">
                    <p>Welcome to Navigation with Kolibri 2.0!</p>
                    <button onclick="addNavigationPointAtRuntime()" >Add navigation point</button>
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

