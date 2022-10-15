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
    const [listController, selectionController] = pageController.getPageContentControllers();

    const projectPage =  () => {
        const [contentWrapper] = dom(`
                <div id="contentWrapper">
                    <div class="card">
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
                </div>
            `);

        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }

        const master = projectMasterView(listController, selectionController, );
        document.getElementById('masterContainer').append(...master);

        const detailForm = projectDetailView(selectionController, document.getElementById('detailCard'));
        document.getElementById('detailContainer').append(...detailForm);

        document.querySelector("head style").textContent += pageCss;

        // binding of the main view
        document.getElementById('plus').onclick    = _ => listController.addModel();
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

