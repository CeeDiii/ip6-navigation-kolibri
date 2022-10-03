import { Attribute, VALUE } from "../kolibri/presentationModel.js";
import { EventType } from "./EventType.js";
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
 * @property { (newNavPoint:String) => Boolean } addNavigationPoint - takes a string with the identifier for a new Navigation Point.
 *              Add the Navigation Point to the model, if it does not already exist. Return true, if the operation was successful.
 * @property { (listener:NavigationListenerType) => void } addNavigationListener - add a callback function as a listener for Navigation Events.
 *              The callback will be executed, when a navigation event occurs.
 * @property { () => String } getLocation - get the currently selected location of the navigation.
 * @property { (newLocation:String) => void } setLocation - set the currently selected location of the navigation.
 * @property { (navPoint:String, newIndex:Number) => void } setOrderOfNavigationPoint - change the order of the navigation.
 *              After successfully executing this function, the navPoint will have the index of newIndex. 
 * @property { () => [String] } getNavigationPoints - returns a list of all Navigation Points.
 * @property { (pageName:String, currentContent:HTMLDivElement) => void } setPageContent - saves the provided HTMLDivElement into the model under the key of the pageName.
 * @property { (pageName:String) => HTMLDivElement } getPageContent - returns the pageContent under the given pageName.
 *              If no page content is found, null is returned.
 * @property { (updatedHomePage:String) => void } setHomePage - set a new homepage as fallback if no hash is provided in the page call.
 * @property { () => String } getHomePage - get the homepage.
 */

/** 
 * @constructor 
 * @param   { !String } initialHomePage - the string that represents the identifier of the homepage, acts as a fallback, if no hash is provided with the page call
 * @return  { NavigationModelType }
 * @example
 * const navigationModel = NavigationModel("home");
 */
const NavigationModel = initialHomePage => {
    const navigationPoints    = Attribute([]); // TODO
    const location            = Attribute(initialHomePage); // TODO
    const navigationListeners = [];
    const pageContents        = {}; // TODO remove
    let   homePage            = initialHomePage; // TODO think if remove

    const getObsValue = obs => obs.getObs(VALUE).getValue();
    const compareNavPoints = (first, second) => first.toLowerCase() === second.toLowerCase();

    const addNavigationPoint = newNavPoint => { // TODO
        const navPoints = getObsValue(navigationPoints);
        const navPointExists = navPoints.findIndex(navObs => compareNavPoints(getObsValue(navObs), newNavPoint));
        if(navPointExists !== -1) return false;
        const navPointAttr = Attribute(newNavPoint);
        navPointAttr.setConverter(attr => attr.toString());
        navPoints.push(navPointAttr);
        navigationListeners.forEach(callback => callback(NavigationEvent(EventType.NAVBAR_CHANGE, newNavPoint, newNavPoint)));
        return true;
    };

    addNavigationPoint(homePage);

    return {
        addNavigationListener: callback => navigationListeners.push(callback),
        getLocation: () => getObsValue(location), // TODO
        setLocation: newLocation => { // TODO
            const lastLocation = getObsValue(location);
            if(compareNavPoints(lastLocation, newLocation)) return;
            location.getObs(VALUE).setValue(newLocation);
            navigationListeners.forEach(callback => callback(NavigationEvent(EventType.PAGE_CHANGE, getObsValue(location), lastLocation)));
        },
        addNavigationPoint,
        setOrderOfNavigationPoint: (navPoint, newIndex) => { // TODO
            const navPoints = getObsValue(navigationPoints);
            const current = navPoints.findIndex(navObs => compareNavPoints(getObsValue(navObs), navPoint));
            if (current >= 0 && current !== newIndex) {
                const currentItem = navPoints.splice(current, 1)[0];
                navPoints.splice(newIndex, 0, currentItem);
                navigationListeners.forEach(callback => callback(NavigationEvent(EventType.NAVBAR_CHANGE, navPoint, navPoint)));
            }
        },
        getNavigationPoints: () => { // TODO
            const navPoints = getObsValue(navigationPoints);
            const retNavPoints = [];
            navPoints.forEach(obs => retNavPoints.push(getObsValue(obs)));
            return retNavPoints;
        },

        setPageContent: (pageName, currentContent) => pageContents[pageName] = currentContent, // TODO remove
        getPageContent: pageName => pageContents[pageName], // TODO remove

        setHomePage: updatedHomePage => updatedHomePage.startsWith('#') ? homePage = updatedHomePage.substring(1) : homePage = updatedHomePage,
        getHomePage: () => homePage
    }
};
