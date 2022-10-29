import {personProjectDetailView, personProjectMasterView} from "./person/masterDetailProjector";
import {personPageCss} from "./person/instantUpdateProjector";
import {dom} from "../kolibri/util/dom";

export { PageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @param { !HTMLDivElement } pinToElement
 * @param { !String } contentFilePath - relative to index.html!
 * @param { String } stylesheetFilePath - relative to index.html!
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('house');
 * HomePageProjector(homePageController);
 */

const PageProjector = (pageController, pinToElement, contentFilePath, stylesheetFilePath) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const pageStyling = document.getElementById('page-style');

    // const contentControllers = pageController.getPageContentControllers();

    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            // generate content
            // projectContent(...contentControllers);
            // ...
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
            pageStyling.href = stylesheetFilePath;
            projectPage();
        }
    });

    return {
        projectPage
    }
};

