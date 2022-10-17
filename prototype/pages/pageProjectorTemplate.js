export { PageProjector }
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

const PageProjector = pageController => {
    const pageWrapper = document.getElementById('content');
    const contentWrapper = document.createElement("div");

    // const contentControllers = pageController.getPageContentControllers();

    const initialize = () => {
        // generate content
        // projectContent(...contentControllers);
        // ...
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

