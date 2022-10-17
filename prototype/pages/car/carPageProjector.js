import { dom } from "../../kolibri/util/dom.js";
import { carProjectMasterView, carProjectDetailView } from "../car/masterDetailProjector.js";
import { carPageCss } from "../car/instantUpdateProjector.js";

export { CarPageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @template T
 * @constructor
 * @param { PageControllerType } pageController
 * @returns { PageProjectorType }
 */

const CarPageProjector = pageController => {
    const pageWrapper = document.getElementById('content');
    const contentWrapper = document.createElement("div");
    const [listController, selectionController] = pageController.getPageContentControllers();

    const initialize = () => {
        const contentDomCollection = dom(`
                    <div class="card" id="masterCard">
                        <h1>Car List</h1>
                    
                        <div class="holder" id="masterContainer">
                            <button id="plus" autofocus> + </button>
                        </div>
                    </div>
                    
                    <div class="card" id="detailCard">
                        <h1>Car Detail</h1>
                    
                        <div class="holder" id="detailContainer">
                        </div>
                    </div>
            `);

        contentWrapper.append(...contentDomCollection);
        const masterContainer = contentWrapper.children["masterCard"]
            .children["masterContainer"];
        const plusButton = masterContainer.children["plus"];
        const detailCard = contentWrapper.children["detailCard"];
        const detailContainer = detailCard.children["detailContainer"];

        const master = carProjectMasterView(listController, selectionController, );
        masterContainer.append(...master);

        const detailForm = carProjectDetailView(selectionController, detailCard);
        detailContainer.append(...detailForm);

        document.querySelector("head style").textContent += carPageCss;

        // binding of the main view
        plusButton.onclick = _ => listController.addModel();
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

