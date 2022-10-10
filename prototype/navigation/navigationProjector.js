import { Attribute, HASH, obsValueOf, VALUE } from "../kolibri/presentationModel.js";
import {ObservableList} from "../kolibri/observable.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 * @property { (navigationConstructDiv: HTMLDivElement) => void } projectNavigation
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @return  { NavigationProjectorType }
 * @example
 * TODO
 */
const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const navigationAnchors = ObservableList([]);
    navigationAnchors.onAdd(anchor => controller.registerClicklistener());

    return {
        projectNavigation: navigationConstructDiv => positionWrapper.replaceChild(positionWrapper.firstChild, navigationConstructDiv),
    }
};