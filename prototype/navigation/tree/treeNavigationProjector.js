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
    positionWrapper.classList.add('tree-nav');
    const observableNavigationAnchors = ObservableList([]);

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

        // check if node is root element or if parentNode already exists
        if (parentNode === null) {
            tree.append(...navPointDom);
        } else {
            const parentName = parentNode.getValue();
            const parentLi = findElementById(tree, parentName);
            parentLi.classList.add('caret');

            // check if parent needs a new sublist for its children
            let childrenNodeList = parentLi.children.namedItem(parentName + '-children');
            if (childrenNodeList === null) {
                // create sublist for children and append child
                childrenNodeList = document.createElement('ol');
                childrenNodeList.id = parentName + '-children';
                parentLi.append(childrenNodeList);
            }

            childrenNodeList.append(...navPointDom);

            childrenNodeList.classList.add('nested');
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
        navigationDiv.append(tree);

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    /**
     * Finds an HTML element by its ID in an HTML Collection
     *
     * @function
     * @param { HTMLElement } tree
     * @param { String } searchId
     * @return { HTMLLIElement|null }
     */
    function findElementById(tree, searchId){
        if(tree.id === searchId){
            return tree;
        } else if (tree.children != null){
            let result = null;
            for(let i=0; result == null && i < tree.children.length; i++){
                result = findElementById(tree.children[i], searchId);
            }
            return result;
        }
        return null;
    }

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
    });

    controller.onNavigationHashAdd(hash => {

        // CREATE BINDINGS
        controller.getPageController(hash).onParentChanged(newParent => {
            const pageName = controller.getPageController(hash).getValue();
            const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
            observableNavigationAnchors.add(newNavPoint);
            projectNavigation();
        });

        controller.getPageController(hash).onIsVisibleChanged(visible => {
            const pageName = controller.getPageController(hash).getValue();
            const pageLi = findElementById(tree, pageName);
            if (visible) {
                pageLi.classList.remove('invisible');
            } else {
                pageLi.classList.add('invisible');
            }
            projectNavigation();
        });
        // END
    });
};
