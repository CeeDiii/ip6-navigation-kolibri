import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

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

    // const tree = dom(`
    //     <ol id="tree"></ol>
    // `);

    const tree = document.createElement('ol');
    tree.id = 'tree';

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @param { !PageControllerType } parentNode - the parent of this node or null if no parent exists
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName, parentNode) => {
        // Initialize your navigation anchors here...

        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}">${pageName}</a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${pageName}">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        navPointDom[pageName].append(anchor);

        if (parentNode !== null && parentNode !== undefined) {
            const parentName = parentNode.getValue();
            const parentLi = findElementById(tree, parentName);
            let childList = parentLi.children[parentName + '-children'];
            if (childList !== null && childList !== undefined) {
                childList.append(...navPointDom);
            } else {
                childList = document.createElement('ol');
                childList.id = parentName + '-children';
                childList.append(...navPointDom);
                parentLi.append(childList);
            }
        } else {
            tree.append(...navPointDom);
        }

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
        // insert your projector code here...
        navigationDiv.append(tree);

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    const findElementById = (tree, searchId) => {
        let result = null;
        for (let i = 0; i < tree.childElementCount; i++) {
            if (tree.children[i].id === searchId) {
                result = tree.children[i];
                break;
            } else {
                result = findElementById(tree.children[i].children, searchId);
            }
        }
        return result;
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {

        // CREATE BINDINGS
        controller.getPageController(hash).onParentChanged(newParent => {
            const pageName = controller.getPageController(hash).getValue();
            const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
            observableNavigationAnchors.add(newNavPoint);
            projectNavigation();
        });
        // END
    });
};
