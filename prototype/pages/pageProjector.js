export { PageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { !HTMLDivElement } content
 * @returns { PageProjectorType }
 */

const PageProjector = content => {
    const contentWrapper = document.getElementById('content');

    return {
        projectPage: () => {
            if (contentWrapper.firstChild === null) {
                contentWrapper.appendChild(content);
            } else {
                contentWrapper.replaceChild(contentWrapper.firstChild, content);
            }
        }
    }
};

