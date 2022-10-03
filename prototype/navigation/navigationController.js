import {ACTIVE, Attribute, VALUE} from "../kolibri/presentationModel.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @property { (listener:NavigationListenerType) => void } addModelChangeListener - register a callback function as a listener for model changes.
 *              The callback will be executed, when a model change occurs.
 * @property { (newNavPoint:PageModelType) => void } addNavigationPoint - Delegates function to the model.
 *              Takes a string with the identifier for a new Navigation Point. Add the Navigation Point to the model, if it does not already exist. 
 *              Return true, if the operation was successful.
 * @property { (callback: onValueChangeCallback<PageModelType>)  => void } onLocationChanged -
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
    const currentLocation = Attribute(null);

    // Use native browser functionality with hashes to reload content from model
    window.onhashchange = () => {
        if(currentLocation.valueOf() !== {}) {
            currentLocation.getObs(ACTIVE).setValue(false);
        }
        console.log(model.singleAttr.valueOf()[window.location.hash]);
        currentLocation.getObs(VALUE).setValue(model.singleAttr.valueOf()[window.location.hash]);
        currentLocation.getObs(ACTIVE).setValue(true);
    };

    return {
        addNavigationPoint: newNavPoint => model.addNavigationPoint(newNavPoint),
        onLocationChanged:  currentLocation.getObs(VALUE).onChange,
    }
};