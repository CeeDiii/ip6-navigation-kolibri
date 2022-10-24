import { ObservableList } from "../../kolibri/observable.js";
import {dom} from "../../kolibri/util/dom.js";

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
 * NavigationProjector(navigationController, pinToNavElement);
 */


const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];
    const anchorListWrappers = {};

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
            <a href="${hash}">
                <span class="icon" id="${navigationPointName}-icon-wrapper">
                    <img class="icon" id="${navigationPointName}-icon" alt="${navigationPointName}-icon">
                </span>
                <span class="text">${navigationPointName}</span>
            </a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${navigationPointName}">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        // append anchor to li tag
        navPointDom[navigationPointName].append(anchor);
        anchorListWrappers[navigationPointName] = navPointDom[0];

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {

        const navigation = dom(`
            <div id="bubbleStateWrapper" class="navigation">
                <ul id="bubbleStateNavPointWrapper">
                    <!-- Placeholder for navigation li elements and indicator -->
                </ul>
            </div>
        `);

        navigationAnchors.forEach(anchor => {
            const pageController = controller.getPageController(anchor.hash);
            const isVisible = pageController.getIsVisible();

            if(isVisible) {
                const navigationPointName = anchor.hash.substring(1);
                const navPoint = anchorListWrappers[navigationPointName];
                navigation["bubbleStateWrapper"].children["bubbleStateNavPointWrapper"].append(navPoint);
            }
        });

        const indicator = dom(`<div class="indicator"></div>`);
        navigation["bubbleStateWrapper"].children["bubbleStateNavPointWrapper"].append(...indicator);
        positionWrapper.replaceChildren(...navigation);
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const newNavPoint = initializeNavigationPoint(hash);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS TO MODEL
        controller.getPageController(hash).onVisitedChanged(visited => {
            if (visited) {
                const anchor = navigationAnchors.find(/** HTMLAnchorElement */ a => {
                    const urlHash = a.hash;
                    return urlHash === hash;
                });
                if (anchor !== undefined) {
                    anchor.classList.add("visited");
                }
            }
        });

        controller.getPageController(hash).onActiveChanged(active => {
            const pageName = hash.substring(1);
            if (active) {
                if (anchorListWrappers[pageName] !== undefined) {
                    anchorListWrappers[pageName].classList.add("active");
                }
            } else {
                if (anchorListWrappers[pageName] !== undefined) {
                    anchorListWrappers[pageName].classList.remove("active");
                }
            }
        });

        controller.getPageController(hash).onActiveChanged(active => {
            const pageName = hash.substring(1);
            if (active) {
                const title = document.getElementsByTagName("title")[0];
                title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
            }
        });

        controller.getPageController(hash).onIsVisibleChanged(() => projectNavigation());

        controller.getPageController(hash).onActiveChanged(active => {
            const pageController = controller.getPageController(hash);
            if (active && pageController.getIsVisible() === false) {
                positionWrapper.classList.add('invisiblePage');
            } else {
                positionWrapper.removeAttribute('class');
            }
        });

        controller.getPageController(hash).onIconChanged((newIcon, oldIcon) => {
            /** HTMLAnchorElement */
            const anchor = navigationAnchors.find(/** HTMLAnchorElement */ a => {
                const urlHash = a.href.substring(a.href.indexOf("#"));
                return urlHash === hash;
            });
            if (anchor !== undefined) {
                anchor.classList.remove(oldIcon);
                anchor.classList.add(newIcon);
            }
        });
        // END

        projectNavigation();
    });
};
