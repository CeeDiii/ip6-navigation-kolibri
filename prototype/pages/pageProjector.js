export { PageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @template T
 * @constructor
 * @param { PageControllerType } pageController
 * @param { T } contentController
 * @returns { PageProjectorType }
 */

const PageProjector = (pageController, contentController) => {
    const pageWrapper = document.getElementById('content');

    const projectPage = () => {
        // generate content
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

