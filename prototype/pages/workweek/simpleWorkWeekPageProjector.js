import { dom } from "../../kolibri/util/dom.js";
import { projectWeek } from "./workweek/simpleWeekProjector.js";

export { SimpleWorkWeekPageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @param { !HTMLDivElement } pinToElement
 * @returns { PageProjectorType }
 */

const SimpleWorkWeekPageProjector = (pageController, pinToElement) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const [weekController] = pageController.getPageContentControllers();

    const initialize = () => {
        const fieldset = dom(`
            <fieldset name="workingHoursInput" id="workingHoursInput">
                <legend>Work Week</legend>
            </fieldset>
        `);

        const staticContent = dom(`
            <div>
                <h2>Composing Projectors</h2>
                <p>We go from simple to more advanced user interfaces by combining previous work
                    without touching (and possibly compromising) previous functionality.
                    You cannot break what you do not touch.
                </p>
                <p>The
                    <a href="https://dierk.github.io/Home/projectorPattern/ProjectorPattern.html">projector pattern</a>
                    encourages compositionality. The
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workweek/simpleWeekProjector.js"
                    >simpleWeekProjector</a> delegates to
                    the already existing
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workday/simpleDayProjector.js"
                    >simpleDayProjector</a>,
                    which in turn relies on the generic
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleFormProjector.js"
                    >simpleFormProjector</a> that again delegates to
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleInputProjector.js"
                    >simpleInputProjector</a>.
                </p>
                <p> The visual appearance of an application needs to stay fresh and appealing.
                    This is why it is so important that we can replace projectors very easily in the
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workweek/starter.js"
                    >starter</a>.
                </p>
                <p>Visuals are ephemeral but logic is here to stay. This is why we never bind logic directly to
                    the view but against the model. We allow the view (and how it binds to the model) to change
                    frequently while keeping controller logic sustainable.
                </p>
        
                <h2>Composing Controllers</h2>
                <p>The business rules are the long-living core of the application. They are an investment.
                    We invest in their test cases and their implementation. So, obviously, we want to build them
                    properly without inconsistencies that would come from duplication. Controllers avoid
                    duplication by composing more complex controllers from simpler ones.
                </p>
                <p >
                    For each day in the work week,
                    the same business rules as in <a href="../workday/WorkingHours.html">workday</a> apply.
                </p>
                <p>
                    Since our <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workweek/weekController.js"
                    >weekController</a> delegates all work to the already existing
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workday/dayController.js"
                    >dayController</a>, we can be sure to have the same
                    business rules in place and that we enforce them correctly. We do not even have to test.
                </p>
                <p>
                    The <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workday/dayController.js"
                    >dayController</a> in turn delegates to the
                    generic
                    <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/kolibri/projector/simpleForm/simpleInputController.js"
                    >simpleInputController</a>
                    to ensure proper binding against the presentation model.
                </p>
        
                <h2>Testing</h2>
                <p>We only have to test those parts of the application that we add on top of the already existing projectors and
                    controllers. This is another benefit of delegating most of the work to existing, well-tested code.
                </p>
                <p >
                    The <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workweek/simpleWeekProjectorTest.js"
                    >simpleWeekProjectorTest</a> simply asserts that
                    the "total" views per day and week are available and updated on user input.
                </p>
                <p>
                    The <a href="https://github.com/WebEngineering-FHNW/Kolibri/tree/main/docs/src/examples/workweek/weekControllerTest.js"
                    >weekControllerTest</a> does the equivalent for
                    proper calculation of the actual total number of minutes as exposed on the controller API.
                </p>
        
                <h2>Next Step</h2>
                <p>
                    The "work week" has shown us how multiple inputs can coordinate to achieve a common goal.
                </p>
                <p> The next step is to make this coordination even more elaborate with multi-way editing in a
                    <a href="../person/MasterDetail.html">master-detail</a> view.
                </p>
        
                <p class="until"></p>
        
            </div>
        `);

        contentWrapper.append(...fieldset);
        contentWrapper.append(...staticContent);
        const workingHoursInput = contentWrapper.children["workingHoursInput"];
        workingHoursInput.append(...projectWeek(weekController));
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

