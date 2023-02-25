import { projectDay } from "./simpleDayProjector.js";

export { WorkDayPageProjector }

/**
 * PageProjectorType is responsible to project a PageModelType's content to the DOM.
 * A PageProjectorType binds itself to the DOM when the Page is activated.
 * A PageProjectorType observes the PageModelType via a PageControllerType.
 *
 * @typedef PageProjectorType
 */

/**
 * A constructor for a PageProjectorType.
 *
 * @constructor
 * @template T
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @param { String } contentFilePath - the path to the static html content relative to index.html! Can be null.
 * @param { ...?T } pageContentProjectors - optional pageContentProjectors used to project dynamic content.
 * @returns { PageProjectorType }
 * @example
 * const workDayController = PageController("home", null);
 * workDayController.setIconPath('./navigation/icons/house.svg');
 * WorkDayPageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const WorkDayPageProjector = (pageController, pinToElement, contentFilePath, ...pageContentProjectors) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const [dayController] = pageController.getDynamicContentControllers();
    const [pageSwitchProjector] = pageContentProjectors;

    /**
     * A function that initializes the content and stores it in the pageWrapper.
     *
     * @function
     * @return { void }
     */
    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            contentWrapper.innerHTML = contentHtml;

            const checkDisabled   = contentWrapper.querySelector("#checkDisabled");
            const checkReadOnly   = contentWrapper.querySelector("#checkReadOnly");
            const checkRequired   = contentWrapper.querySelector("#checkRequired");
            const checkDarkTheme  = contentWrapper.querySelector("#checkDarkTheme");
            checkDisabled.onclick = _ => checkDisabled.checked
                ? workingHoursInput.setAttribute("disabled", "on") // one can disable a fieldset
                : workingHoursInput.removeAttribute("disabled");

            const inputs = () => workingHoursInput.querySelectorAll("input");
            checkReadOnly.onclick = _ => checkReadOnly.checked
                ? inputs().forEach(input => input.setAttribute("readonly", "on")) // only inputs can be set to readonly
                : inputs().forEach(input => input.removeAttribute("readonly"));

            checkRequired.onclick = _ => checkRequired.checked
                ? inputs().forEach(input => input.setAttribute("required", "on"))
                : inputs().forEach(input => input.removeAttribute("required"));


            const workingHoursInput = contentWrapper.querySelector('#workingHoursInput');
            workingHoursInput.append(...projectDay(dayController));
            const workday = contentWrapper.querySelector('#workday');
            workday.prepend(workingHoursInput);
            const switchDiv = pageSwitchProjector.projectNavigation(workday);
            const workDayHolder = contentWrapper.querySelector('#workday-holder');
            workDayHolder.append(switchDiv);
        });

        const pageClass = pageController.getQualifier();
        contentWrapper.classList.add(pageClass);
    };

    /**
     * A function that creates the DOM binding and initializes the page on first activation.
     *
     * @function
     * @return { void }
     */
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

    /**
     * An async function that fetches the static page content from a given filePath and returns a promise with the string content.
     *
     * @param filePath - the filePath that belongs to the static page content
     * @return { Promise<String> }
     */
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
                console.error(`HTTP error: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    pageController.onActiveChanged(active => {
        if (active) {
            projectPage();
        }
    });
};

