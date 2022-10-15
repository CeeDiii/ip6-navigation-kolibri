import { dom } from "../../kolibri/util/dom.js";
import { projectMasterView, projectDetailView } from "../../examples/person/masterDetailProjector.js";
import { pageCss } from "../../examples/person/instantUpdateProjector.js";

export { PersonPageProjector }

/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @returns { PageProjectorType }
 */
const PersonPageProjector = pageController => {
    const pageWrapper = document.getElementById('content');
    const contentWrapper = document.createElement("div");
    const [listController, selectionController] = pageController.getPageContentControllers();

    const initialize = () => {
        const contentDomCollection = dom(`
                    <div class="card" id="masterCard">
                        <h1>Person List</h1>
                    
                        <div class="holder" id="masterContainer">
                            <button id="plus" autofocus> + </button>
                        </div>
                    </div>
                    
                    <div class="card" id="detailCard">
                        <h1>Person Detail</h1>
                    
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

        const master = projectMasterView(listController, selectionController, );
        masterContainer.append(...master);

        const detailForm = projectDetailView(selectionController, detailCard);
        detailContainer.append(...detailForm);

        document.querySelector("head style").textContent += pageCss;

        // binding of the main view
        plusButton.onclick = _ => listController.addModel();
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

    pageController.onActiveChanged(active => {
        if (active) {
            projectPage();
        }
    });

    return {
        projectPage
    }
};

