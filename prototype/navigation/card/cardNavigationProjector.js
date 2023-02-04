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
            <div class="card-nav nav-wrapper">
                <div class="card-header">
                    <a id="card-logo" href="${controller.getHomePage()}">
                        <img src="${controller.getWebsiteLogo()}" alt="${controller.getWebsiteName()}-logo"/>
                    </a>
                    <p>${controller.getWebsiteName()}</p>
                </div>
                <div class="links">
                    <!-- Placeholder for navigation links -->
                </div>
            </div>
        `);

        const links = navWrapper.getElementsByClassName('links')[0];

        parentAnchors.forEach(parentAnchor => {
            const pageController = controller.getPageController(parentAnchor.hash);

            if (pageController.isVisible()) {
                const parentQualifier = pageController.getQualifier();
                const [parentWrapper] = dom(`
                <div id="${parentQualifier}-wrapper" class="nav-point-wrapper"></div>
            `);
                parentWrapper.append(parentAnchor);

                parentWrapper.onclick = () => {
                    const oldActive = document.getElementsByClassName('open')[0];
                    if (undefined !== oldActive) {
                        oldActive.classList.remove('open');
                    }
                    if (oldActive !== parentWrapper) {
                        parentWrapper.classList.toggle('open');
                    }
                };

                const children = childrenCards[parentQualifier];

                if (undefined === children || 0 === children.length) {
                    parentWrapper.classList.add('childless');
                } else {
                    const [cardWrapper] = dom(`
                        <div class="card-wrapper"></div>
                    `);

                    children.forEach(childAnchor => {
                        const childController = controller.getPageController(childAnchor.hash);
                        if (childController.isVisible()) {
                            childAnchor.classList.add('grid-item');
                            // TODO remove placeholder description
                            const [cardIcon, cardDesc] = dom(`
                                <img src="${childController.getIcon()}" alt="${childController.getValue()}-icon">
                                <p>${childController.getDescription()}
                                Showing the report that runs the latest test cases live in your  browser window. The Kolibri test facility does not require any build steps or extra tooling.
                                </p>
                            `);
                            if (0 === childAnchor.children.length) {
                                const header = childAnchor.firstChild;
                                childAnchor.removeChild(header);
                                const [cardTitle] = dom(`
                                    <span>${header.textContent}</span>
                                `);
                                childAnchor.append(cardIcon, cardTitle, cardDesc);
                            }
                            const gridProps = childController.getGrid();
                            if (1 === gridProps.rowSpan) {
                                childAnchor.classList.add('half');
                            }

                            cardWrapper.append(childAnchor);
                        }
                    });

                    parentWrapper.append(cardWrapper);
                }
                links.append(parentWrapper);
            }
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
        if (null !== newWebsiteName) {
            const cardHeader = document.getElementsByClassName('card-header')[0];
            if (undefined !== cardHeader) {
                cardHeader.lastElementChild.innerHTML = newWebsiteName;
            }
        }
    });

    controller.onWebsiteLogoChanged(newWebsiteLogoSrc => {
        if (null !== newWebsiteLogoSrc) {
            const cardHeaderLogo = document.getElementById('card-logo');
            if (null !== cardHeaderLogo) {
                cardHeaderLogo.firstElementChild.src = newWebsiteLogoSrc;
                console.log(cardHeaderLogo.firstElementChild);
            }
        }
    });

    controller.onFavIconChanged(newFavIconSrc => {
        if (null !== newFavIconSrc) {
            const favIcon = document.getElementById('favicon');
            favIcon.href = newFavIconSrc;
        }
    });

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();

        const newNavPoint = initializeNavigationPoint(qualifier, hash, pageName);
        observableNavigationAnchors.add(newNavPoint);

        pageController.onParentChanged((newParent, oldParent) => {
            addAnchor(pageController, newParent, oldParent, parentAnchors, childrenCards);
            projectNavigation();
        });

        pageController.onActiveChanged(isActive => {
            setActiveCSSClass(isActive, qualifier, pageController.getParent());
        });

        pageController.onVisitedChanged(visited => {
            setVisitedCSSClass(visited, qualifier);
        });

        pageController.onVisibleChanged(isVisible => {
            setVisibleCSSClass(isVisible, qualifier, pageController.getParent());
        });

        projectNavigation();
    });

    /* ********************* Utility functions for bindings ***************************** */

    /**
     * A utility function that adds an anchor to the corresponding data structure depending on if it is a child or a parent.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !Object } childrenCards
     */
    const addAnchor = (pageController, newParent, oldParent, parentAnchors, childrenCards) => {
        if (null === newParent) {
            addParentAnchor(pageController, newParent, oldParent, parentAnchors, childrenCards);
        } else {
            addChildAnchor(pageController, newParent, parentAnchors, childrenCards);
        }
    };

    /**
     * A utility function that adds an anchor to the parent anchors data structure
     * and removes it from the child anchors if present.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !Object } childrenCards
     */
    const addParentAnchor = (pageController, newParent, oldParent, parentAnchors, childrenCards) => {
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();
        // initialize empty child array for new parents
        if (undefined === childrenCards[qualifier]) {
            childrenCards[qualifier] = [];
        }
        if (null !== oldParent) {
            const children = childrenCards[oldParent.getQualifier()];
            const deleteAnchorIndex = children.findIndex(anchor => anchor.id === qualifier + '-anchor');
            if (deleteAnchorIndex !== -1) {
                const newParentAnchor = children[deleteAnchorIndex];
                transformChildToParentAnchor(newParentAnchor, pageName);
                parentAnchors.push(newParentAnchor);
                removeAtIndex(children, deleteAnchorIndex);
            }
        }
    };

    /**
     * A utility function that adds an anchor to the children anchors data structure
     * and removes it from the parent anchors if present.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !Object } childrenCards
     */
    const addChildAnchor = (pageController, newParent, parentAnchors, childrenCards) => {
        const qualifier = pageController.getQualifier();
        const deleteAnchorIndex = parentAnchors.findIndex(anchor => anchor.id === qualifier + '-anchor');
        const children = childrenCards[newParent.getQualifier()];
        const childExists = children.findIndex(child => child.id === qualifier + '-anchor');

        if (-1 === childExists) {
            children.push(parentAnchors[deleteAnchorIndex]);
        }
        if (-1 !== deleteAnchorIndex) {
            removeAtIndex(parentAnchors, deleteAnchorIndex);
        }
    };

    /**
     * A utility function that changes transforms the child anchor html structure
     * so that it represents the parent anchor html structure. The function also removes child CSS classes.
     *
     * @param { !HTMLAnchorElement } anchor
     * @param { !String } pageName
     */
    const transformChildToParentAnchor = (anchor, pageName) => {
        anchor.innerHTML = pageName;
        anchor.classList.forEach(cssClass => anchor.classList.remove(cssClass));
    };

    /**
     * A utility function that removes an array element at index i.
     * @template T
     * @param { T[] } arr
     * @param { number } i
     */
    const removeAtIndex = (arr, i) => arr.splice(i, 1);

    /**
     * A utility function that sets the active CSS class for the given qualifier
     * and removes the class from the old active qualifier.
     *
     * @function
     * @param { !Boolean } isActive
     * @param { !String } qualifier
     * @param { ?PageControllerType } parentController
     */
    const setActiveCSSClass = (isActive, qualifier, parentController) => {
        const thisAnchor = document.getElementById(qualifier + '-anchor');
        if (null !== parentController) {
            setActiveCSSClass(isActive, parentController.getQualifier(), null);
        }
        if (null !== thisAnchor) {
            if (isActive) {
                thisAnchor.classList.add('active');
            } else if (!isActive) {
                thisAnchor.classList.remove('active');
            }
        }

    };

    /**
     * A utility function that sets the visited CSS class for the given qualifier
     *
     * @function
     * @param { !Boolean } visited
     * @param { !String } qualifier
     */
    const setVisitedCSSClass = (visited, qualifier) => {
        if (visited) {
            const anchor = document.getElementById(qualifier + '-anchor');
            anchor.classList.add('visited');
        }
    };

    /**
     * A utility function that adds or removes the invisible CSS class to a given node with the qualifier.
     *
     * @function
     * @param { !Boolean } isVisible
     * @param { !String } qualifier
     * @param { ?PageControllerType } parentController
     */
    const setVisibleCSSClass = (isVisible, qualifier, parentController) => {
        let thisAnchor;
        if (null !== parentController) {
            thisAnchor = document.getElementById(qualifier + '-anchor');
        } else {
            thisAnchor = document.getElementById(qualifier + '-wrapper');
        }
        if (null !== thisAnchor) {
            if (isVisible) {
                thisAnchor.classList.remove('invisible');
            } else if (!isVisible) {
                thisAnchor.classList.add('invisible');
            }
        }

    };
};
