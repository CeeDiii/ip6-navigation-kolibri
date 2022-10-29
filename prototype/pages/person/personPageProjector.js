import { dom } from "../../kolibri/util/dom.js";
import { personProjectMasterView, personProjectDetailView } from "./masterDetailProjector.js";
import { personPageCss } from "./instantUpdateProjector.js";

export { PersonPageProjector }

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
 */
const PersonPageProjector = (pageController, pinToElement, contentFilePath) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const [listController, selectionController] = pageController.getPageContentControllers();

    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            contentWrapper.innerHTML = contentHtml;
            const masterContainer = document.getElementById('masterContainer');
            const plusButton = document.getElementById('plus');
            const detailCard = document.getElementById('detailCard');
            const detailContainer = document.getElementById('detailContainer');

            const master = personProjectMasterView(listController, selectionController,);
            masterContainer.append(...master);

            const detailForm = personProjectDetailView(selectionController, detailCard);
            detailContainer.append(...detailForm);

            document.querySelector("head style").textContent += personPageCss;

            // binding of the main view
            plusButton.onclick = _ => listController.addModel()
        });

    };

    const projectPage =  () => {
        if (contentWrapper.firstChild === null) {
            initialize();
        }

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

