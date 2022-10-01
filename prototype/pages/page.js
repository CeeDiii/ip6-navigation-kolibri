export { Page }

/**
 * PageProjectorType is a projector for page content.
 *
 * @typedef PageProjectorType
 * @property { () => HTMLDivElement } projectPage
 */

/**
 * IPage is an interface. TODO complete jsdoc
 *
 * @typedef IPage<T>
 * @template T
 * @property { () => void }                               activate
 * @property { (currentContent: HTMLDivElement) => void } passivate
 * @property { () => void }                               initialize
 *
 */

/**
 * Constructor for an IPage. TODO complete jsdoc
 *
 * @param { PageProjectorType } pageProjector
 * @returns  IPage<T>
 * @constructor
 * @example
 * TODO add example
 */
const Page = pageProjector => {
    let content = "";
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

