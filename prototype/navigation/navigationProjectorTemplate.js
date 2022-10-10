import { ObservableList } from "../kolibri/observable.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @return { NavigationProjectorType }
 * @example
 * TODO
 */

const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    const projectNavigation = () => {
        const navigationDiv = document.createElement("nav");
        // insert your projector code here...

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const newNavPoint = document.createElement('a');
        newNavPoint.setAttribute('href', hash);
        newNavPoint.innerText = hash.substring(1);
        observableNavigationAnchors.add(newNavPoint);
        projectNavigation();
    });
};