export { Page }

/**
 * IPage is an interface. TODO complete jsdoc
 *
 * @typedef IPage<T>
 * @template T
 * @property { () => HTMLDivElement }                     activate
 * @property { (currentContent: HTMLDivElement) => void } passivate
 * @property { () => void }                               initialize
 *
 */

/**
 * Constructor for an IPage. TODO complete jsdoc
 *
 * @param { IPageProjector } pageProjector
 * @returns  IPage<T>
 * @constructor
 * @example
 * TODO add example
 */
const Page = pageProjector => {
    let content = document.createElement('div');
    content.innerText = "Empty page. Please initialize";

    return {
        activate: () => content,
        passivate: currentContent => {
            content = currentContent;
        },
        initialize: () => {
            content = pageProjector.projectPage()
        }
    }
};

