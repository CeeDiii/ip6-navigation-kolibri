import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { BreadCrumbProjector }

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
 * NavigationProjector(navigationController, pinToNavElement);
 */
const BreadCrumbProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const anchorMap = {};
    const navigationAnchors = [];
    const DEPTH = 3;

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param hash - the hash that represents the identifier of a page
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = hash => {
        const navigationPointName = hash.substring(1);
        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}">${navigationPointName}</a>
        `);

        // get anchor from collection, directly returning anchorDom[0] does not work because of reasons unknown to the author
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
        navigationDiv.classList.add("bread-crumbs");
        const breadCrumbs = [];

        // iterate through history in reverse and add breadcrumbs until DEPTH is reached if they do not exist already
        for(let i = navigationAnchors.length-1; i >= 0 && breadCrumbs.length < DEPTH; i--) {
            if (!breadCrumbs.includes(navigationAnchors[i])) {
                breadCrumbs.push(navigationAnchors[i]);
            }
        }

        // reverse breadCrumbs because of reversing loop above
        breadCrumbs.reverse();

        breadCrumbs.forEach((breadCrumb, index) => {
            breadCrumb.onclick = () => {
                // cut index at last index of current bread crumb, if user navigates via bread crumb
                navigationAnchors.length = navigationAnchors.lastIndexOf(breadCrumb);

            };

            navigationDiv.append(breadCrumb);

            // do not add ">" on last bread crumb
            if (index < breadCrumbs.length - 1) {
                navigationDiv.append(">");
            }

        });

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => controller.registerAnchorClickListener(anchor));

    controller.onNavigationHashAdd(hash => {
        const newNavPoint = initializeNavigationPoint(hash);
        anchorMap[hash] = newNavPoint;
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS
        controller.getPageController(hash).onActiveChanged(active => {
            if (active) {
                navigationAnchors.push(anchorMap[hash]);
                projectNavigation();
            }
        });
        // END
    });
};
