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
 * @returns { PageProjectorType }
 */

const SimpleWorkWeekPageProjector = pageController => {
    const pageWrapper = document.getElementById('content');
    const contentWrapper = document.createElement("div");
    const [weekController] = pageController.getPageContentControllers();

    const initialize = () => {
        const fieldset = dom(`
            <fieldset name="workingHoursInput" id="workingHoursInput">
                <legend>Work Week</legend>
            </fieldset>
        `);

        contentWrapper.append(...fieldset);
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

