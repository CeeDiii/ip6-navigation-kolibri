import { dom } from "../../kolibri/util/dom.js";
import { carProjectMasterView, carProjectDetailView } from "../car/masterDetailProjector.js";
import { carPageCss } from "../car/instantUpdateProjector.js";

export { CarPageProjector }
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

const CarPageProjector = (pageController, pinToElement, contentFilePath) => {
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

            const master = carProjectMasterView(listController, selectionController, );
            masterContainer.append(...master);

            const detailForm = carProjectDetailView(selectionController, detailCard);
            detailContainer.append(...detailForm);

            document.querySelector("head style").textContent += carPageCss;

            // binding of the main view
            plusButton.onclick = _ => listController.addModel();
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

