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
 * @param { !String } contentFilePath - relative to index.html!
 * @param { String } stylesheetFilePath - relative to index.html!
 * @returns { PageProjectorType }
 */

const PageNotFoundProjector = (pageController, pinToElement, contentFilePath, stylesheetFilePath) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement('div');

    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            contentWrapper.innerHTML = contentHtml;

            if (pageWrapper.firstChild === null) {
                pageWrapper.append(contentWrapper);
            } else {
                pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
            }
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
            const stylesheet = document.createElement("link");
            stylesheet.rel = 'stylesheet';
            stylesheet.href = stylesheetFilePath;
            stylesheet.id = pageController.getHash().substring(1) + '-style';

            document.getElementsByTagName('head')[0].append(stylesheet);
            stylesheet.onload = () => projectPage();
        } else {
            const pageStylesheet = document.getElementById(pageController.getHash().substring(1) + '-style');
            if(pageStylesheet != null) {
                document.getElementById(pageController.getHash().substring(1) + '-style').remove();
            }
        }
    });

    return {
        projectPage
    }
};

