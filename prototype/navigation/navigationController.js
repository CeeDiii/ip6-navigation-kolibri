import { EventType } from './EventType.js';
import { NavigationEvent } from "./NavigationEvent.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @property { (listener:NavigationListenerType) => void } addModelChangeListener - register a callback function as a listener for model changes.
 *              The callback will be executed, when a model change occurs.
 * @property { (newNavPoint:String, listener:NavigationListenerType) => Boolean } addNavigationPoint - Delegates function to the model.
 *              Takes a string with the identifier for a new Navigation Point. Add the Navigation Point to the model, if it does not already exist. 
 *              Return true, if the operation was successful.
 * @property { () => String } getLocation - Delegates function to the model
 *              Get the currently selected location of the navigation.
 * @property { (navPoint:String, newIndex:Number) => void } setOrderOfNavigationPoint - Delegates function to the model
 *              Change the order of the navigation. After successfully executing this function, the navPoint will have the index of newIndex. 
 * @property { () => [String] } getNavigationPoints - Delegates function to the model.
 *              Returns a list of all Navigation Points.
 * @property { (pageName:String, currentContent:HTMLDivElement) => void } setPageContent - Delegates function to the model.
 *              Saves the provided DOMString into the model under the key of the pageName.
 * @property { (pageName:String) => HTMLDivElement } getPageContent - Delegates function to the model.
 *              Returns the pageContent under the given pageName. 
 *              If no page content is found, null is returned.
 * @property { (updatedHomePage:String) => void } setHomePage - Delegates function to the model.
 *             set a new homepage as fallback if no hash is provided in the page call.
 *
 * @property { () => String } getHomePage - Delegates function to the model.
 *             get the homepage.
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

    // Sending event after document is loaded for content to render
    window.onload = () => {
        model.setLocation('#' + model.getHomePage());
        modelChangeListeners.forEach(callback => callback(NavigationEvent(EventType.PAGE_CHANGE, window.location.hash, window.location.hash)));
    };

    /**
     * Add a callback function that will be executed when a model change occurs
     *
     * @template T
     * @callback { callback: onChange<EventType, T> } callback - function that will be called
     */
    const addModelChangeListener = callback => modelChangeListeners.push(callback);

    /**
     * Notify observers that a model change occurred
     *
     * @param { NavigationEventType } navEvent
     *
     */
    const onModelChange = navEvent => {
        if (navEvent.getEventType() === EventType.PAGE_CHANGE && window.location.hash !== navEvent.getHash()) {
            window.location.hash = navEvent.getValue();
        }
        modelChangeListeners.forEach(callback => callback(navEvent));
    };

    model.addNavigationListener(onModelChange);

    return {
        addModelChangeListener,
        addNavigationPoint: (newNavPoint, callback) => {
            addModelChangeListener(callback);
            return model.addNavigationPoint(newNavPoint);
        },
        getLocation: () => model.getLocation(),
        setOrderOfNavigationPoint: (navPoint, newIndex) =>  model.setOrderOfNavigationPoint(navPoint, newIndex),
        getNavigationPoints: () => model.getNavigationPoints(),
        setPageContent: (pageName, currentContent) => model.setPageContent(pageName, currentContent),
        getPageContent: pageName => model.getPageContent(pageName),
        setHomePage: updatedHomePage => model.setHomePage(updatedHomePage),
        getHomePage: () => model.getHomePage()
    }
};