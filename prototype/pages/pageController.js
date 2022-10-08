import { ACTIVE, VALUE } from "../kolibri/presentationModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 *
 * @typedef PageController
 * @property { () => HTMLDivElement } activate -
 * @property { (latestContentState:HTMLDivElement) => void } passivate -
 * @property { (callback: onValueChangeCallback<Boolean>)  => void } onActiveChanged -
 * @property { (callback: onValueChangeCallback<HTMLDivElement>)  => void } onValueChanged -
 *
 */

/**
 * Constructor for a pageController.
 *
 * @param { PageModelType } model
 * @returns  PageController
 * @constructor
 *
 */

const PageController = model => ({
    activate: ()                  => model.activate(), // returns "projector", getter for content variable in model
    passivate: latestContentState => model.passivate(latestContentState), // TODO remove parameter and store content from projector on passivate // setter for content variable in model
    onActiveChanged:                 model.singleAttr.getObs(ACTIVE).onChange, // signals the status change of activate / passivate
    onValueChanged:                  model.singleAttr.getObs(VALUE).onChange, // represents the content change

});