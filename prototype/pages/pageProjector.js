export { PageProjector }

/**
 * IPageProjector is a projector for page content.
 *
 * @typedef IPageProjector
 * @property { () => HTMLDivElement } projectPage - a function that creates the HTMLDivElement that represents this view
 *
 */

/**
 * Constructor for an IPageProjector.
 *
 * @param { () => HTMLDivElement } projectPageFunc
 * @returns  IPageProjector<T>
 * @constructor
 * @example
 * const projectPageFunc = () => {
 *     const content = document.createElement('div');
 *     content.innerText = 'Hello World';
 * }
 * const pageProjector = PageProjector(projectPageFunc);
 */
const PageProjector = projectPageFunc => ({
    projectPage: projectPageFunc
});

