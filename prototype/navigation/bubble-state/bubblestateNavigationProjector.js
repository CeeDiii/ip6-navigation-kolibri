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
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName) => {

        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}">
                <span class="icon" id="${pageName}-icon-wrapper">
                    <img class="icon" id="${pageName}-icon" alt="${pageName}-icon">
                </span>
                <span class="text">${pageName}</span>
            </a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${pageName}">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        // append anchor to li tag
        navPointDom[pageName].append(anchor);
        anchorListWrappers[pageName] = navPointDom[0];

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
            <div id="bubble-state-nav-wrapper">
                <div id="bubbleStateWrapper" class="bubble-state-nav">
                    <ul id="bubbleStateNavPointWrapper">
                        <!-- Placeholder for navigation li elements and indicator -->
                    </ul>
                </div>
            </div>
        `);

        navigationAnchors.forEach(anchor => {
            const pageController = controller.getPageController(anchor.hash);
            const isVisible = pageController.getIsVisible();

            if(isVisible) {
                const navigationPointName = anchor.hash.substring(1);
                const navPoint = anchorListWrappers[navigationPointName];
                navigation['bubble-state-nav-wrapper'].children['bubbleStateWrapper'].children['bubbleStateNavPointWrapper'].append(navPoint);
            }
        });

        const indicator = dom(`<div class="indicator"></div>`);
        navigation['bubble-state-nav-wrapper'].children['bubbleStateWrapper'].children['bubbleStateNavPointWrapper'].append(...indicator);
        positionWrapper.replaceChildren(...navigation);
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const pageName = controller.getPageController(hash).getValue();
        const newNavPoint = initializeNavigationPoint(hash, pageName);
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
            const pageName = controller.getPageController(hash).getValue();
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
            const pageName = controller.getPageController(hash).getValue();
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
