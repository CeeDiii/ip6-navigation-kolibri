export { PageProjector }

/**
 * IPageProjectorType is a projector for page content.
 *
 * @typedef IPageProjector
 * @property { () => HTMLDivElement } projectPage
 */

/**
 * Constructor for an IPageProjector. TODO complete jsdoc
 *
 * @param { () => HTMLDivElement } projectPageFunc
 * @returns  IPageProjector<T>
 * @constructor
 * @example
 * TODO add example
 */
const PageProjector = projectPageFunc => ({
    projectPage: projectPageFunc
});

