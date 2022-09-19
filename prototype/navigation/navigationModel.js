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
    const navigationPoints    = Attribute([]);
    const location            = Attribute(initialHomePage);
    const navigationListeners = [];
    const pageContents        = {};
    let   homePage            = initialHomePage;

    const addNavigationPoint = newNavPoint => {
        const navPoints = navigationPoints.getObs(VALUE).getValue();
        const navPointExists = navPoints.findIndex(navObs => navObs.getObs(VALUE).getValue().toLowerCase() === newNavPoint.toLowerCase());
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
        getLocation: () => location.getObs(VALUE).getValue(),
        setLocation: newLocation => {
            const lastLocation = location.getObs(VALUE).getValue();
            if(lastLocation.toLowerCase() === newLocation.toLowerCase()) return;
            location.getObs(VALUE).setValue(newLocation);
            navigationListeners.forEach(callback => callback(NavigationEvent(EventType.PAGE_CHANGE, location.getObs(VALUE).getValue(), lastLocation)));
        },
        addNavigationPoint,
        setOrderOfNavigationPoint: (navPoint, newIndex) => {
            const navPoints = navigationPoints.getObs(VALUE).getValue();
            const current = navPoints.findIndex(navObs => navObs.getObs(VALUE).getValue().toLowerCase() === navPoint.toLowerCase());
            if (current >= 0 && current !== newIndex) {
                const currentItem = navPoints.splice(current, 1)[0];
                navPoints.splice(newIndex, 0, currentItem);
                navigationListeners.forEach(callback => callback(NavigationEvent(EventType.NAVBAR_CHANGE, navPoint, navPoint)));
            }
        },
        getNavigationPoints: () => {
            const navPoints = navigationPoints.getObs(VALUE).getValue();
            const retNavPoints = [];
            navPoints.forEach(value => retNavPoints.push(value.getObs(VALUE).getValue()));
            return retNavPoints;
        },

        setPageContent: (pageName, currentContent) => pageContents[pageName] = currentContent,
        getPageContent: pageName => pageContents[pageName],

        setHomePage: updatedHomePage => updatedHomePage.startsWith('#') ? homePage = updatedHomePage.substring(1) : homePage = updatedHomePage,
        getHomePage: () => homePage
    }
};
