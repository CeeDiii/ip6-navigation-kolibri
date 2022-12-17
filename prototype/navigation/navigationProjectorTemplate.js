import { ObservableList } from "../kolibri/observable.js";
import {dom} from "../kolibri/util/dom";

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
 * const navigationController = NavigationController();
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */
const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName) => {
        // Initialize your navigation anchors here...

        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}">${pageName}</a>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add("your-navigation-class");
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

    controller.onWebsiteNameChanged(newWebsiteName => {
        // add website name anywhere to website
    });

    controller.onWebsiteLogoChanged(newWebsiteLogoSrc => {
        // add logo anywhere to website
    });

    controller.onFavIconChanged(newFavIconSrc => {
        // add favicon to website
    });

    controller.onNavigationHashAdd(hash => {
        const pageName = controller.getPageController(hash).getValue();
        const newNavPoint = initializeNavigationPoint(hash, pageName);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS
        // controller.getPageController(hash).onValueChanged((newValue, oldValue) => {
        //      do something with binding
        //});
        // END

        projectNavigation();
    });
};
