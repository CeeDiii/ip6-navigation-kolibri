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

    // const contentControllers = pageController.getPageContentControllers();

    const projectPage = () => {
        // generate content
        // projectContent(...contentControllers);
        // ...
        if (pageWrapper.firstChild === null) {
            // replace with generated content
            pageWrapper.append(null);
        } else {
            // replace with generated content
            pageWrapper.replaceChild(null, pageWrapper.firstChild);
        }
    };

    pageController.onActiveChanged(() => {
        projectPage();
    });

    return {
        projectPage
    }
};

