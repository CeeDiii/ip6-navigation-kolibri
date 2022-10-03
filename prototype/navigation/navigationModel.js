import { Attribute, VALUE } from "../kolibri/presentationModel.js";
import { NavigationEvent } from "./NavigationEvent.js";

export { NavigationModel }

/**
 * @callback NavigationListenerType
 * @param { NavigationEvent } navEvent 
 * @return { void }
 */

/**
 * Model containing the application navigation-data
 *
 * @typedef NavigationModelType
 * @template T
 * @property { (newNavPoint:IPage<T>) => Boolean } addNavigationPoint
 * @property { () => AttributeType<IPage<T>>} getLocation
 * @property { (newLocation:String) => void } setLocation
 */

/** 
 * @constructor
 * @template T
 * @param   { !IPage<T> } initialHomePage - the string that represents the identifier of the homepage, acts as a fallback, if no hash is provided with the page call
 * @return  { NavigationModelType }
 * @example
 * const navigationModel = NavigationModel("home");
 */
const NavigationModel = initialHomePage => {
    const navigationPoints    = {}; // TODO
    const location            = Attribute(initialHomePage); // TODO

    const getObsValue = obs => obs.getObs(VALUE).getValue();
    //const compareNavPoints = (first, second) => getObsValue(first.getName()).toLowerCase() === getObsValue(second.getName()).toLowerCase();

    const addNavigationPoint = newNavPoint => { // TODO
        const navPointExists = navigationPoints[newNavPoint.getName().getObs(VALUE).getValue()];
        if(navPointExists !== undefined) return false;
        const navPointAttr = Attribute(newNavPoint);
        getObsValue(navPointAttr).getName().setConverter(attr => attr.toString());
        navigationPoints[newNavPoint.getName().getObs(VALUE).getValue()] = navPointAttr;
        return true;
    };

    addNavigationPoint(initialHomePage);

    return {
        addNavigationPoint,
        getLocation: () => location,
        setLocation: newLocation => location.getObs(VALUE).setValue(navigationPoints[newLocation].getObs(VALUE).getValue()),
    }
};
