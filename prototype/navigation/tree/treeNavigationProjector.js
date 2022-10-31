import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { NavigationProjector as TreeNavigationProjector }

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
            <a href="${hash}" id="${pageName}-a">${pageName}</a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${pageName}-li">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        anchor.innerHTML = '|--- ' + pageName;

        navPointDom[pageName + '-li'].append(anchor);

        // check if node is root element or if parentNode already exists
        if (parentNode === null) {
            tree.append(...navPointDom);
        } else {
            const parentName = parentNode.getValue();
            appendNode(...navPointDom, parentName);
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
        navigationDiv.classList.add('tree-nav');
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
    const findElementById = (tree, searchId) =>{
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
    };

    const appendNode = (node, parentName) => {
        const parentLi = findElementById(tree, parentName + '-li');
        let childrenNodeList = parentLi.children.namedItem(parentName + '-children');
        if (childrenNodeList === null) {
            // create sublist for children and append child
            childrenNodeList = document.createElement('ol');
            childrenNodeList.id = parentName + '-children';
            parentLi.append(childrenNodeList);
        }
        childrenNodeList.append(node);
    };


    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
    });

    controller.onNavigationHashAdd(hash => {

        // CREATE BINDINGS
        controller.getPageController(hash).onParentChanged((newParent, oldParent) => {
            const pageName = controller.getPageController(hash).getValue();
            const thisNode = findElementById(tree, pageName + '-li');
            if (thisNode === null) { // check if this node has not been initialized yet
                const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
                observableNavigationAnchors.add(newNavPoint);
            } else {
                // check if old parent is root and remove node from root
                if (oldParent === null) {
                    tree.removeChild(thisNode);
                    const parentName = newParent.getValue();
                    appendNode(thisNode, parentName);
                } else if (newParent !== null) { // check if new parent and old parent are not root and remove old node from old parent
                    const oldParentName = oldParent.getValue();
                    const oldParentChildrenNodeList = findElementById(tree, oldParentName + '-children');
                    oldParentChildrenNodeList.removeChild(thisNode);
                    // check if list of children has no more elements and if so remove it
                    if (oldParentChildrenNodeList.children.length < 1) {
                        const oldParentNode = findElementById(tree, oldParentName + '-li');
                        oldParentNode.removeChild(oldParentChildrenNodeList);
                    }
                    const parentName = newParent.getValue();
                    appendNode(thisNode, parentName);
                } else { // append node to root if new parent is null
                    tree.append(thisNode);
                }
            }
            projectNavigation();
        });

        controller.getPageController(hash).onIsVisibleChanged(visible => {
            const pageName = controller.getPageController(hash).getValue();
            const pageLi = findElementById(tree, pageName + '-li');
            if (visible) {
                pageLi.classList.remove('invisible');
            } else {
                pageLi.classList.add('invisible');
            }
            projectNavigation();
        });

        controller.getPageController(hash).onActiveChanged((newActive, oldActive) => {
            const pageName = controller.getPageController(hash).getValue();
            const pageAnchor = findElementById(tree, pageName + '-a');
            if (newActive) {
                pageAnchor.append(' ☚');
            } else if (newActive !== oldActive) {
                pageAnchor.innerText = pageAnchor.innerText.substring(0, pageAnchor.innerText.indexOf(' ☚'));
            }
            projectNavigation();
        });
        // END
    });
};
