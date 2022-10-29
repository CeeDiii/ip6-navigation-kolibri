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
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('house');
 * HomePageProjector(homePageController);
 */

const SimpleFormPageProjector = (pageController, pinToElement) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");

    // const contentControllers = pageController.getPageContentControllers();

    const initialize = () => {
        const content = dom(`
            <div id="form-holder">
        
            </div>
        
            <section>
                <h2>Simple Kolibri Forms</h2>
                <p> Kolibri can create model-view-controller (MVC) forms by using the
                    <a href="https://dierk.github.io/Home/projectorPattern/ProjectorPattern.html">projector pattern</a>.
                </p>
                <p> It only takes a single line of code to create the form,
                    set up the presentation models, and bind all required listeners such that
                    model and view are always kept in sync. After that, any controller can solely
                    work on the presentation models without ever touching the view.
                </p>
                <p> Only <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/simpleForm/starter.js"
                    >starter.js</a> is application-specific. It sets up the information of
                    what the form should consist of.
                </p>
                <p> Our initial, simplistic form does not contain any business logic and can therefore use the
                    generic
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleFormController.js"
                    >SimpleFormController</a>.
                    If we had any business logic, we would put it in a specialized
                    controller and write test cases against that controller. Since we currently have no business
                    logic, we have no specialized controller and no test cases for the logic.
                </p>
                <p> Models, view, and bindings are totally generic and provided by Kolibri. The current generic
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleFormProjector.js"
                    >simpleFormProjector</a> creates a simple form with
                    simple input types. Each such type is created and bound by the generic
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleInputProjector.js"
                    >simpleInputProjector</a>.
                    "Simple" means types that the standard HTML Input element can handle it (no selects or multiple values).
                </p>
                <p> The remaining non-generic thing to test is the general setup. We test this in
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/simpleForm/simpleFormViewTest.js"
                    >simpleFormViewTest.js</a>.
                    It also serves as an example of how to do integration testing.
                </p>
            </section>
        
        
            <section>
                <h2>Next Step</h2>
                <p>
                    If all we ever wanted is a passive web form that we can submit, we wouldn't bother
                    creating controllers, models, binding, and so on. But our investment will pay off as
                    soon as there is interactivity and business logic in our application.
                </p>
                <p>
                    Proceed with <a href="../workday/WorkingHours.html">work day</a> where we
                    combine form elements with business rules.
                </p>
            </section>
        `);

        const formHolder = content["form-holder"];
        const form = projectForm(pageController.getPageContentControllers()[0]);
        formHolder.append(...form);
        contentWrapper.append(...content);
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
