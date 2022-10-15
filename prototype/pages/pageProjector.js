export { PageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @template T
 * @constructor
 * @param { T } contentController
 * @returns { PageProjectorType }
 */

const PageProjector = contentController => {
    const pageWrapper = document.getElementById('content');

    return {
        projectPage: () => {
            // generate content
            // ...
            if (pageWrapper.firstChild === null) {
                // replace with generated content
                pageWrapper.append(null);
            } else {
                // replace with generated content
                pageWrapper.replaceChild(null, pageWrapper.firstChild);
            }
        }
    }
};

