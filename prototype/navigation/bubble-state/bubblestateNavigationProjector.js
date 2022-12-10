import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { NavigationProjector as BubbleStateNavigationProjector }

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
        const styleTag = document.createElement('style');
        styleTag.id = 'bubble-state-nav-styles';

        const navigation = dom(`
            <div id="bubble-state-nav-wrapper">
                <div id="bubbleStateWrapper" class="bubble-state-nav">
                    <ul id="bubbleStateNavPointWrapper">
                        <!-- Placeholder for navigation li elements and indicator -->
                    </ul>
                </div>
            </div>
        `);

        let i = 1;
        navigationAnchors.forEach(anchor => {
            const pageController = controller.getPageController(anchor.hash);
            const isNavigational = pageController.getIsNavigational();
            const isVisible = pageController.getIsVisible();

            if(isNavigational && isVisible) {
                const navigationPointName = anchor.hash.substring(1);
                const navPoint = anchorListWrappers[navigationPointName];
                const dynamicIndicatorStyle = `
                    .bubble-state-nav ul li:nth-child(${i}).active ~.indicator {
                        transform: translateX(calc(70px * ${i-1}));
                    }
                `;
                styleTag.append(dynamicIndicatorStyle);
                navigation['bubble-state-nav-wrapper'].children['bubbleStateWrapper'].children['bubbleStateNavPointWrapper'].append(navPoint);
                i++;
            }
        });

        // Add styling for indicator
        const head = document.getElementsByTagName('head')[0];
        const documentStyles = document.getElementById('bubble-state-nav-styles');
        if (null === documentStyles) {
            head.append(styleTag);
        } else {
            head.replaceChild(styleTag, documentStyles);
        }

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
        controller.getPageController(hash).onActiveChanged(active => {
           setActiveCSSClass(hash, active);
           setPageTitle(hash, active);
           handleIndicatorVisibility(hash, active);
        });

        controller.getPageController(hash).onVisitedChanged(visited => {
            setVisitedCSSClass(hash, visited);
        });

        controller.getPageController(hash).onIsNavigationalChanged(() => projectNavigation());

        controller.getPageController(hash).onIsVisibleChanged(() => projectNavigation());

        controller.getPageController(hash).onIconChanged(newIcon => {
            setIconSource(hash, newIcon);
        });
        // END

        projectNavigation();
    });

    /* ********************* Utility functions for bindings ***************************** */
    /**
     * A utility function that sets the active CSS class for the given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const setActiveCSSClass = (hash, active) => {
        const pageName = controller.getPageController(hash).getValue();
        if (active) {
            if (undefined !== anchorListWrappers[pageName]) {
                anchorListWrappers[pageName].classList.add("active");
            }
        } else {
            if (undefined !== anchorListWrappers[pageName]) {
                anchorListWrappers[pageName].classList.remove("active");
            }
        }
    };

    /**
     * A utility function that sets the HTML title attribute to the value of the page identified by hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const setPageTitle = (hash, active) => {
        const pageName = controller.getPageController(hash).getValue();
        if (active) {
            const title = document.getElementsByTagName("title")[0];
            title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        }
    };

    /**
     * A utility function that sets the visited CSS class for the given hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } visited
     */
    const setVisitedCSSClass = (hash, visited) => {
        if (visited) {
            const anchor = navigationAnchors.find(a => a.hash === hash);
            if (undefined !== anchor) {
                anchor.classList.add("visited");
            }
        }
    };

    /**
     * A utility function that sets the icon source for the given hash to newIcon.
     *
     * @function
     * @param { !String } hash
     * @param { !String } newIcon
     */
    const setIconSource = (hash, newIcon) => {
        const anchor = navigationAnchors.find(a => a.hash === hash);
        if(undefined !== anchor) {
            const imageToReplace = anchor.getElementsByTagName('img')[0];
            if (null !== imageToReplace) {
                imageToReplace.setAttribute('src', newIcon);
            }
        }
    };

    /**
     * A utility function that sets the CSS class for the indicator when an invisible page is displayed
     * and removes the CSS class when a visible.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const handleIndicatorVisibility = (hash, active) => {
        const pageController = controller.getPageController(hash);
        if (active && pageController.getIsVisible() === false) {
            positionWrapper.classList.add('invisiblePage');
        } else {
            positionWrapper.classList.remove('invisiblePage');
        }
    };
};
