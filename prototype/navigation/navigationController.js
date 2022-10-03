import { ACTIVE, VALUE } from "../kolibri/presentationModel.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @template T
 * @property { (listener:NavigationListenerType) => void } addModelChangeListener - register a callback function as a listener for model changes.
 *              The callback will be executed, when a model change occurs.
 * @property { (newNavPoint:IPage<T>) => void } addNavigationPoint - Delegates function to the model.
 *              Takes a string with the identifier for a new Navigation Point. Add the Navigation Point to the model, if it does not already exist. 
 *              Return true, if the operation was successful.
 */

/**
 * @constructor
 * @param   { !NavigationModelType } model - the navigation model this controller coordinates
 * @return  { NavigationControllerType }
 * @example
 * const navigationModel = NavigationModel("home");
 * const navigationController = NavigationController(navigationModel);
 */
const NavigationController = model => {
    const modelChangeListeners = [];

    // Use native browser functionality with hashes to reload content from model
    window.onhashchange = () => model.setLocation(window.location.hash);

    model.getLocation().getObs(VALUE).onChange(() => console.log(model.getLocation().getObs(VALUE).getValue().getName().getObs(VALUE).getValue()));

    return {
        addNavigationPoint: newNavPoint => model.addNavigationPoint(newNavPoint),
        onActiveChanged: model.getLocation().getObs(ACTIVE).onChange,
    }
};