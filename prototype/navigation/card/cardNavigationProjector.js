import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { NavigationProjector as CardNavigationProjector }

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
    const parentAnchors = [];
    const childrenCards = {};

    /**
     * A function that initializes a navigation anchor
     *
     * @function
     * @param { !String } qualifier - the qualifier that uniquely
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (qualifier, hash, pageName) => {

        const [anchor] = dom(`
            <a id="${qualifier}-anchor" href="${hash}">${pageName}</a>
        `);

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const [navWrapper] = dom(`
            <div class="nav-wrapper">
                <div id="card-logo">
                    <img src="../prototype/navigation/icons/placeholder.svg" alt="placeholder"/>
                    <p>Placeholder for Website Title</p>
                </div>
                <div class="links">
                    <!-- Placeholder for navigation links -->
                </div>
            </div>
        `);

        const links = navWrapper.getElementsByClassName('links')[0];

        parentAnchors.forEach(parentAnchor => {
            const parentQualifier = parentAnchor.id.split('-')[0]; // extract qualifier from something like "home-anchor"
            const [parentWrapper] = dom(`
                <div class="nav-point-wrapper active open"></div>
            `);
            parentWrapper.append(parentAnchor);

            const children = childrenCards[parentQualifier];

            if (undefined !== children) {
                const [cardWrapper] = dom(`
                    <div class="card-wrapper"></div>
                `);

                if (undefined !== children){
                    children.forEach(childAnchor => {
                        const childController = controller.getPageController(childAnchor.hash);
                        childAnchor.classList.add('grid-item');
                        const [cardIcon, cardTitle, cardDesc] = dom(`
                        <img src="${childController.getIcon()}" alt="${childController.getValue()}-icon">
                        <span>${childController.getValue()}</span>
                        <p>${childController.getDescription()}</p>
                    `);
                    if (0 === childAnchor.children.length) {
                        childAnchor.append(cardIcon, cardTitle, cardDesc);
                    }
                    cardWrapper.append(childAnchor);
                    });
                }
                parentWrapper.append(cardWrapper);
            }
            links.append(parentWrapper);
        });

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navWrapper)
        } else {
            positionWrapper.replaceChild(navWrapper, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        const pageController = controller.getPageController(anchor.hash);
        const qualifier = pageController.getQualifier();
        const parent = pageController.getParent();

        if (null === parent) {
            parentAnchors.push(anchor);
        } else {
            childrenCards[qualifier].push(anchor);
        }
        projectNavigation();
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
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();

        const newNavPoint = initializeNavigationPoint(qualifier, hash, pageName);
        observableNavigationAnchors.add(newNavPoint);

        pageController.onParentChanged((newParent, oldParent) => {
           if (null !== newParent) {
               const deleteAnchorIndex = parentAnchors.findIndex(anchor => anchor.id === qualifier + '-anchor');
               const children = childrenCards[newParent.getQualifier()];
               if (-1 === children.findIndex(child => child.id === qualifier + '-anchor')) {
                   children.push(parentAnchors[deleteAnchorIndex]);
               }
               if (-1 !== deleteAnchorIndex) {
                    parentAnchors.splice(deleteAnchorIndex, 1);
               }
           } else {
               if (undefined === childrenCards[qualifier]) {
                   childrenCards[qualifier] = [];
               }
               if (null !== oldParent) {
                   const children = childrenCards[oldParent.getQualifier()];
                   const deleteAnchorIndex = children.findIndex(anchor => anchor.id === qualifier + '-anchor');
                   if (deleteAnchorIndex !== -1) {
                       children.splice(deleteAnchorIndex, 1);
                   }
               }
           }
           projectNavigation();
        });

        projectNavigation();
    });
};
