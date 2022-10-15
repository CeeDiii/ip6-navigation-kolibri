import { dom } from "../../kolibri/util/dom.js";
import { projectMasterView, projectDetailView } from "../../examples/person/masterDetailProjector.js";
import { pageCss } from "../../examples/person/instantUpdateProjector.js";

export { PersonPageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @template T
 * @constructor
 * @param { PageControllerType } pageController
 * @param { [ListControllerType<T>, SelectionControllerType<T>] } controllers
 * @returns { PageProjectorType }
 */

const PersonPageProjector = (pageController, controllers) => {
    const pageWrapper = document.getElementById('content');

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
            // replace with generated content
            pageWrapper.append(contentWrapper);
        } else {
            // replace with generated content
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }

        const listController = controllers[0];
        const selectionController = controllers[1];

        const master = projectMasterView(listController, selectionController, );
        document.getElementById('masterContainer').append(...master);

        const detailForm = projectDetailView(selectionController, document.getElementById('detailCard'));
        document.getElementById('detailContainer').append(...detailForm);

        document.querySelector("head style").textContent += pageCss;

        // binding of the main view
        document.getElementById('plus').onclick    = _ => listController.addModel();
    };

    pageController.onActiveChanged(() => {
        projectPage();
    });

    return {
        projectPage
    }
};

