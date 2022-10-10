export { PageProjector }
/**
 * @typedef PageProjectorType
 * @property { (content: HTMLDivElement) => void } projectPage
 */

/**
 * @constructor
 * @returns { PageProjectorType }
 */

const PageProjector = () => {
    const contentWrapper = document.getElementById('content');

    return {
        projectPage: content => {
            if (contentWrapper.firstChild === null) {
                contentWrapper.appendChild(content);
            } else {
                contentWrapper.replaceChild(content, contentWrapper.firstChild);
            }
        }
    }
};

