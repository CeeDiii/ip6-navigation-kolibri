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
    activate: ()                  => model.activate(),
    passivate: latestContentState => model.passivate(latestContentState),
    onActiveChanged:                 model.singleAttr.getObs(ACTIVE).onChange,
    onValueChanged:                  model.singleAttr.getObs(VALUE).onChange,
});