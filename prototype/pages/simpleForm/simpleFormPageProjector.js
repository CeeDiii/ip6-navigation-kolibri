import { dom } from "../../kolibri/util/dom.js";
import { projectForm, }  from "../../kolibri/projector/simpleForm/simpleFormProjector.js"


export { SimpleFormPageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @param { !HTMLDivElement } pinToElement
 * @param { !String } contentFilePath - relative to index.html!
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('house');
 * HomePageProjector(homePageController);
 */

const SimpleFormPageProjector = (pageController, pinToElement, contentFilePath) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");

    // const contentControllers = pageController.getPageContentControllers();

    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            contentWrapper.innerHTML = contentHtml;

            const formHolder = document.getElementById('form-holder');
            const form = projectForm(pageController.getPageContentControllers()[0]);
            formHolder.append(...form);
        });
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

    const fetchPageContent = async (filePath) => {
        try {
            const response = await fetch(filePath, {
                    headers: {
                        'Content-Type': 'application/html',
                        'Accept': 'application/html'
                    }
                }
            );
            if (response.ok) {
                const content = await response.text();
                return content;
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
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

