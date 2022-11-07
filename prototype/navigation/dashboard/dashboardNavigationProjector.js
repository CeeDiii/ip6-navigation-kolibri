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

    const tree = document.createElement('ol');
    tree.id = 'tree';

    /**
     * A function that initializes a navigation anchor
     *
     * @function
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @param { ?PageControllerType } parentNode - the parent of this node or null if no parent exists
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName, parentNode) => {

        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}" id="${pageName}-a">
                <span class="icon" id="${pageName}-icon-wrapper">
                    <img class="icon" id="${pageName}-icon" alt="${pageName}-icon">
                </span>
                <span class="text">${pageName}</span>
            </a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${pageName}-li">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        navPointDom[pageName + '-li'].append(anchor);

        // check if node is root element or if parentNode already exists
        if (parentNode === null) {
            tree.append(...navPointDom);
        } else {
            const parentName = parentNode.getValue();
            const navPointLi = navPointDom.namedItem(`${pageName}-li`);
            appendNode(navPointLi, parentName);
        }

        return anchor;
    };

    /**
     * A function that binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add('dashboard-nav');
        navigationDiv.append(tree);

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }

        const toggle = dom(`
            <div id="toggle">
                <img class="icon" alt="toggle icon" src="">
            </div>
        `);

        toggle["toggle"].onclick = () => navigationDiv.classList.toggle('open');
        navigationDiv.append(...toggle);
    };

    /**
     * A function that finds an HTML element by its ID in an HTML Collection
     *
     * @function
     * @param { HTMLElement } tree
     * @param { String } searchId
     * @return { HTMLElement|null }
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

    /**
     * A function that appends a node to a given parentNode in a tree structure.
     *
     * @function
     * @param { !HTMLElement } node
     * @param { !String } parentName
     * @return { void }
     */
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

    /**
     * A function that moves childNode from oldParent to newParent.
     *
     * @param { !HTMLElement } childNode
     * @param { ?PageControllerType } oldParent
     * @param { ?PageControllerType } newParent
     * @return { void }
     */
    const moveChildNode = (childNode, oldParent, newParent, ) => {
        if (newParent === null) { // append node to root if newParent is null
            tree.append(childNode);
        } else if (oldParent === null) { // check if old parent is root and move node from root to newParent
            tree.removeChild(childNode);
            const parentName = newParent.getValue();
            appendNode(childNode, parentName);
        } else { // if new parent and old parent are not root, move node from oldParent to newParent
            const oldParentName = oldParent.getValue();
            const oldParentChildrenNodeList = findElementById(tree, oldParentName + '-children');
            oldParentChildrenNodeList.removeChild(childNode);
            // check if list of children has no more elements and if so remove it
            if (oldParentChildrenNodeList.children.length < 1) {
                const oldParentNode = findElementById(tree, oldParentName + '-li');
                oldParentNode.removeChild(oldParentChildrenNodeList);
            }
            const parentName = newParent.getValue();
            appendNode(childNode, parentName);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {

        // CREATE BINDINGS
        controller.getPageController(hash).onParentChanged((newParent, oldParent) => {
            // Create node if it does not yet exist or move node from oldParent to newParent
            const pageName = controller.getPageController(hash).getValue();
            const thisNode = findElementById(tree, pageName + '-li');
            if (thisNode === null) { // check if this node has not been initialized yet
                const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
                observableNavigationAnchors.add(newNavPoint);
            } else {
                // relocate node
                moveChildNode(thisNode, oldParent, newParent);
            }

            // TODO create functions for bindings to call
            // Add class for styling to newParent if not null and remove it from oldParent if not null
            let newParentPage = null;
            let oldParentPage = null;
            let oldParentHasNoChildren = true;
            if(newParent !== null) {
                const pageNameNewParent = controller.getPageController(newParent.getHash()).getValue();
                newParentPage = findElementById(tree, pageNameNewParent + '-li');
            }
            if(oldParent !== null) {
                const pageNameOldParent = controller.getPageController(oldParent.getHash()).getValue();
                oldParentPage = findElementById(tree, pageNameOldParent + '-li');
            }
            if(oldParentPage !== null) {
                for (const child of oldParentPage.children) {
                    if (child.tagName === 'ol') {
                        oldParentHasNoChildren = false;
                    }
                }
                if (oldParentHasNoChildren) {
                    oldParentPage.classList.remove('parent');
                }
            }
            if(newParentPage !== null && !newParentPage.classList.contains('parent')) {
                newParentPage.classList.add('parent');
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
            const pageController = controller.getPageController(hash);
            const pageName = pageController.getValue();
            const pageAnchor = findElementById(tree, pageName + '-a');
            if (newActive) {
                pageAnchor.classList.add('active');
            } else if (newActive !== oldActive) {
                pageAnchor.classList.remove('active');
            }

            const parentNode = pageController.getParent();
            if (parentNode !== null) {
                const parentName = parentNode.getValue();
                const parentAnchor = findElementById(tree, `${parentName}-a`);
                if (newActive) {
                    parentAnchor.classList.add('parent-active');
                } else if (newActive !== oldActive) {
                    parentAnchor.classList.remove('parent-active');
                }
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

        controller.getPageController(hash).onActiveChanged(active => {
            const pageName = controller.getPageController(hash).getValue();
            if (active) {
                const title = document.getElementsByTagName("title")[0];
                title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
            }
        });
        // END
    });
};
