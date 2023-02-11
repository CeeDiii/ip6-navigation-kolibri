import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { PageSwitchProjector }

/**
 * @typedef NavigationProjectorType
 * @property { (contentWrapper: !HTMLDivElement, exampleDiv: !HTMLDivElement) => void } projectNavgation
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !String } gistID
 * @return { NavigationProjectorType }
 * @example
 * const navigationController = NavigationController();
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */
const PageSwitchProjector = (controller, gistID) => {
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
        const [anchor] = dom(`
            <a href="${hash}">${pageName}</a>
        `);

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @param { !HTMLDivElement } contentWrapper - a div that holds the content. Mandatory.
     * @param { !HTMLDivElement } exampleDiv     - a div with the projection of a running example. Mandatory.
     * @return void
     */
    const projectNavigation = (contentWrapper, exampleDiv) => {
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add("your-navigation-class");

        navigationAnchors.forEach(anchor => {
            // insert your projector code here...
            navigationDiv.append(anchor);
        });

    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onPathChanged(newPath => {
       console.log(newPath);
    });

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const pageName = pageController.getValue();
        const newNavPoint = initializeNavigationPoint(hash, pageName);
        observableNavigationAnchors.add(newNavPoint);
    });

    return projectNavigation;
};
