import { Attribute, HASH, obsValueOf, VALUE } from "../kolibri/presentationModel.js";
import {ObservableList} from "../kolibri/observable.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 * @property { () => void } projectNavigation
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @param { (anchors: [HTMLAnchorElement]) => HTMLDivElement } navigationInitializer
 * @return { NavigationProjectorType }
 * @example
 * TODO
 */

const NavigationProjector = (controller, pinToElement,navigationInitializer) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];
    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });
    controller.onNavigationHashAdd(hash => {
        const newNavPoint = document.createElement('a');
        newNavPoint.setAttribute('href', hash);
        newNavPoint.innerText = hash.substring(1);
        observableNavigationAnchors.add(newNavPoint);
    });

    return {
        projectNavigation: () => {
            if (positionWrapper.firstChild === null) {
                positionWrapper.appendChild(navigationInitializer(navigationAnchors))
            } else {
                positionWrapper.replaceChild(positionWrapper.firstChild, navigationInitializer(navigationAnchors));
            }
        },
    }
};