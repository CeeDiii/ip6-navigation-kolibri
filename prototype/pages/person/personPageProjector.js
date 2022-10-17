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

        const staticContent = dom(`
            <section>
                <h2>Play!</h2>
                <p> Have a go and play around with adding new entries, selecting various entries, start typing in either
                    the master or the detail view, delete entries, and change the lastname to less than three characters.
                    See what happens.
                </p>
                <h2>Multi-Way Editing and Instant Updates</h2>
                <p> Whether you edit in the master or in the detail view, all entries are immediately synchronized.
                </p>
                <p> When there is no selection, the detail view folds away, becomes read-only, and shows no values.
                    It makes absolutely no difference what led to the deselection.
                    BTW: We have chosen to deselect on every delete, such that we can show this effect more easily.
                    In a real application, we would of course rather select the next entry than dropping the selection.
                </p>
                <p> Kolibri makes multi-way editing and other consistent updates throughout the application
                    very easy. You just define what your attribute represents by giving it a
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/person.js">qualifier</a>
                    like "Person.1.firstname".
                    Kolibri takes care that all attributes with the same qualifier are always kept in sync.
                    This applies not only to their values but to all of their visual properties (validity, label,
                    editable, and so on).
                </p>
                <p> Please note that this feature works without any dependencies. No view knows any other view -
                    nor do the models! We can add, remove, or modify any part of the application without touching
                    the other parts and the synchronization still works!
                </p>
                <h2>Business Rules</h2>
                <p> The lastname attributes have a converter to uppercase and a validator for at least three characters.
                    No matter where and how you change, these rules are always enforced and apply wherever the
                    same value occurs. The visualization of validation errors is equally consistent.
                </p>
                <h2>Master-Detail Views as Projectors</h2>
                <p> Master-Detail Views come in an abundance of different ways.
                </p>
                <p> Here we have a list or table as the master view and a form as a detail view.
                    Other master-detail views might be less obvious like tabbed views where the tabs
                    constitute the master. Then there are drop-downs, selections, radio buttons, ribbons,
                    accordions, menus, cover-flows, tiles, and so on. The list is endless.
                </p>
                <p> The Kolibri approach is always the same, no matter which of the many master-detail views we encounter.
                    We bind the selection to a presentation model. This is so repetitive that we can delegate the
                    work to a
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/masterDetailProjector.js"
                    >master-detail projector</a> that delegates the handling of updates to the
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/instantUpdateProjector.js">instant-update
                        projector</a>.
                </p>
                <h2>Testing Master-Detail Views and Multi-Way Editing</h2>
                <p> Manual testing might be appropriate in the prototyping stage, but you will quickly find that testing
                    multi-way editing is particularly cumbersome to do manually. There is just so much clicking around
                    and observing effects. You get bored, become unobservant and bugs creep in.
                </p>
                <p> Test automation comes to the rescue, and it is quite easy to implement. Have a look at
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/personTest.js"
                    >Person test</a> that covers master-detail construction, proper selection handling, and
                    multi-way update. We hope you can pick up the pattern how to write those tests.
                </p>
                <!-- TODO implement tests -->
                <p> You can actually <a href="../../allTests.html">run those tests live
                    in your browser</a> right now!
                </p>
                <p> <a href="../../index.html">Home</a>
                </p>


            </section>
        `);

        contentWrapper.append(...contentDomCollection);
        contentWrapper.append(...staticContent);
        const masterContainer = contentWrapper.children["masterCard"]
            .children["masterContainer"];
        const plusButton = masterContainer.children["plus"];
        const detailCard = contentWrapper.children["detailCard"];
        const detailContainer = detailCard.children["detailContainer"];

        const master = personProjectMasterView(listController, selectionController, );
        masterContainer.append(...master);

        const detailForm = personProjectDetailView(selectionController, detailCard);
        detailContainer.append(...detailForm);

        document.querySelector("head style").textContent += personPageCss;

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

