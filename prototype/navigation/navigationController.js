import { ACTIVE, Attribute, VALUE, valueOf } from "../kolibri/presentationModel.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
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
    window.onhashchange = () => { // TODO remove
        if(valueOf(currentLocation) !== {}) {
            currentLocation.getObs(ACTIVE).setValue(false);
        }
        currentLocation.getObs(VALUE).setValue(valueOf(model.singleAttr)[window.location.hash]);
        currentLocation.getObs(ACTIVE).setValue(true);
    };

    // TODO add click event listener on anchor tags

    // TODO implement facade functions for activate and passivate that can be called from projectors, if projector is not part of controller
    // activate = page => { page.activate() }
    // passivate = (page, newContent) => { page.passivate(newContent) }

    return {
        addNavigationPoint: newNavPoint => model.addNavigationPoint(newNavPoint),
        onLocationChanged:  currentLocation.getObs(VALUE).onChange,
        // TODO add projector method, if projector is not part of controller
    }
};