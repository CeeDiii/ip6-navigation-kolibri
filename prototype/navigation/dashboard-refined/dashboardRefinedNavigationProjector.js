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

    let navigationDiv = null;

    // ************** Create overview and detail wrapper *******************

    const overviewWrapper = document.createElement('div');
    overviewWrapper.classList.add('overview');

    // create overview header
    const overviewLogo = dom(`
            <div class="logo">
                <img src="" alt="website-logo">
            </div>
        `);

    // create overview content wrapper
    const overviewContentWrapper = document.createElement('div');
    overviewContentWrapper.classList.add('content');
    overviewContentWrapper.id = 'overview-content-wrapper';

    const arrowSVGPathRelativeIndex = "../prototype/navigation/icons/right-arrow-gradient.svg";

    // create overview footer
    const overviewToggle = dom(`
            <div class="toggle" onclick="document.getElementById('dashboard-refined-nav').classList.toggle('open')">
                <img src="${arrowSVGPathRelativeIndex}" alt="arrow">
            </div>
        `);

    // create detail header
    const detailHeader = dom(`
            <div class="header">
                <div>
                    Website Title
                </div>
            </div>
        `);

    // create detail content div for tree
    const tree = document.createElement('div');
    tree.classList.add('tree');

    // create detail content wrapper
    const detailWrapper = document.createElement('div');
    detailWrapper.classList.add('detail');

    // ************** END overview and detail wrapper ********************

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
        const idPrefix = hash.slice(1);
        const [anchor] = dom(`<a href="${hash}">${pageName}</a>`);

        const [treeNode] = dom(`
            <div class="tree-node" id="${idPrefix}-node">
                <span>
                    <img id="${idPrefix}-detail-icon" src="" alt="">
                    <!-- placeholder for anchor -->
                </span>
            </div>
        `);

        treeNode.firstElementChild.append(anchor);

        if (null === parentNode) {
            // node is root
            tree.append(treeNode);
        } else {
            const parentNodeInTree = findElementById(tree, parentNode.getHash() +'-node');
            if (null === parentNodeInTree) {
                // if parent is not yet element of the tree we will just append the node
                tree.append(treeNode);
            } else {
                // node is child of an existing parent node in the tree
                parentNodeInTree.append(treeNode);
            }
        }
        return anchor;
    };

    /**
     * A helper function that creates the base structure for this navigation.
     *
     * @function
     * @return void
     */
    const initializeBaseStructure = () => {
        navigationDiv = document.createElement("div");
        navigationDiv.id = 'dashboard-refined-nav';
        navigationDiv.classList.add('dashboard-refined-nav');

        overviewWrapper.append(...overviewLogo);
        overviewWrapper.append(overviewContentWrapper);
        overviewWrapper.append(...overviewToggle);

        // TODO check if append would work
        detailWrapper.prepend(tree);
        detailWrapper.prepend(...detailHeader);

        navigationDiv.append(overviewWrapper, detailWrapper);
    };

    /**
     * A function that binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        if (navigationDiv === null) {
            initializeBaseStructure();
        }

        if (null === positionWrapper.firstChild) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }

        const overviewContentWrapper = document.getElementById('overview-content-wrapper');
        replaceRootNodeHashesWithFirstChildHashes(overviewContentWrapper);
    };

    /**
     * A helper function that replaces the navigation hashes for root nodes
     * with the hash of their first child.
     * This will be done because root nodes are not navigational.
     *
     * @function
     * @param { HTMLElement } overviewContentWrapper - the wrapper for the overview content
     * @return void
     */
    const replaceRootNodeHashesWithFirstChildHashes = overviewContentWrapper => {
        // change navigation hash for root
        for(const rootNode of overviewWrapper.getElementsByClassName('row')) {
            if(undefined !== rootNode) {
                const rootNodeId = rootNode.id;
                const rootIdPrefix = rootNodeId.substring(0, rootNodeId.indexOf('-'));
                const rootNodeInDetailWrapper = findElementById(tree, rootIdPrefix + '-node');
                if(null !== rootNodeInDetailWrapper && 1 === rootNodeInDetailWrapper.children.length) {
                    const firstNavigationalChild = rootNodeInDetailWrapper.getElementsByTagName('a')[0];
                    rootNode.firstElementChild.href = firstNavigationalChild.hash;

                }
            }
        }
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
        } else if (null !== tree.children){
            let result = null;
            for(let i=0; null === result && i < tree.children.length; i++){
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
     * @param { !String } parentIdPrefix
     * @return { void }
     */
    const appendNode = (node, parentIdPrefix) => {
        const parentNode = findElementById(tree, parentIdPrefix + '-node');
        if (null !== parentNode) {
            parentNode.append(node);
        }
    };

    /**
     * A function that adds the given hash as a node the newParent
     * and removes it from the oldParent.
     *
     * @param { !String } hash
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     */
    const addNodeToTree = (hash, newParent, oldParent) => {
        const idPrefix = hash.slice(1);
        const pageName = controller.getPageController(hash).getValue();
        const thisNode = findElementById(tree, idPrefix + '-node');
        if (null === thisNode) { // check if this node has not been initialized yet
            const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
            observableNavigationAnchors.add(newNavPoint);
        } else {
            // relocate node
            moveChildNode(thisNode, oldParent, newParent);
        }
    };

    /**
     * A function that moves childNode from oldParent to newParent.
     *
     * @param { !HTMLElement } childNode
     * @param { ?PageControllerType } oldParent
     * @param { ?PageControllerType } newParent
     * @return { void }
     */
    const moveChildNode = (childNode, oldParent, newParent) => {
        if (null === newParent) { // append node to root if newParent is null
            tree.append(childNode);
        } else if (null === oldParent) { // check if old parent is root and move node from root to newParent
            tree.removeChild(childNode);
            const newParentIdPrefix = newParent.getHash().slice(1);
            appendNode(childNode, newParentIdPrefix);
        } else { // if new parent and old parent are not root, move node from oldParent to newParent
            const oldParentIdPrefix = oldParent.getHash().slice(1);
            const oldParentChildrenNodeList = findElementById(tree, oldParentIdPrefix + '-node');
            oldParentChildrenNodeList.removeChild(childNode);
            const newParentIdPrefix = newParent.getHash().slice(1);
            appendNode(childNode, newParentIdPrefix);
        }
    };

    const projectOverviewNode = pageController => {
        const idPrefix = pageController.getHash().slice(1);

        const overviewNode = findElementById(overviewContentWrapper, idPrefix + '-overview-node');

        if (null === pageController.getParent() && null === overviewNode) {
            const [overviewNavPointNode] = dom(`
                <div class="row" id="${idPrefix}-overview-node" >
                    <a><img id="${idPrefix}-overview-icon" src="${pageController.getIcon()}" alt="${pageController.getValue()}-icon"></a>
                </div>
            `);
            overviewContentWrapper.append(overviewNavPointNode);
        } else if (null === pageController.getParent() && null !== overviewNode) {
            overviewNode.src = pageController.getIcon();
        } else if (null !== pageController.getParent() && null !== overviewNode) {
            overviewContentWrapper.removeChild(overviewNode);
        }
    };

    observableNavigationAnchors.onAdd(anchor => controller.registerAnchorClickListener(anchor));

    controller.onWebsiteNameChanged(newWebsiteName => {
        if (null !== newWebsiteName) {
            const detailHeaderWrapper = detailHeader[0];
            const detailHeaderText = detailHeaderWrapper.firstElementChild;
            detailHeaderText.innerHTML = newWebsiteName;
        }
    });

    controller.onWebsiteLogoChanged(newWebsiteLogoSrc => {
        if (null !== newWebsiteLogoSrc) {
            const logoWrapper = overviewLogo[0];
            const logoImg = logoWrapper.getElementsByTagName('img')[0];
            logoImg.src = newWebsiteLogoSrc;
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



        // CREATE BINDINGS
        pageController.onParentChanged((newParent, oldParent) => {
            addNodeToTree(hash, newParent, oldParent);
            setIconSource(pageController, pageController.getIcon());
            projectOverviewNode(pageController);
            projectNavigation();
        });

        pageController.onActiveChanged((newActive, oldActive) => {
            setActiveCSSClass(hash, newActive, oldActive);
            setParentActiveCSSClass(hash, newActive, oldActive);
            setPageTitle(hash, newActive);
        });

        pageController.onIconChanged(newIcon => setIconSource(pageController, newIcon));

        pageController.onVisibleChanged(isVisible => handleVisibleChange(hash, isVisible));
        // END
    });

    /* ********************* Utility functions for bindings ***************************** */

    /**
     * A utility function that sets the active CSS class for the given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } newActive
     * @param { !Boolean } oldActive
     */
    const setActiveCSSClass = (hash, newActive, oldActive) => {
        const idPrefix = hash.slice(1);
        const activeElement = findElementById(tree, idPrefix + '-node');
        const img = activeElement.getElementsByTagName('img')[0];
        const a   = activeElement.getElementsByTagName('a')[0];
        if (newActive && newActive !== oldActive) {
            img.classList.add('active');
            a.classList.add('active');
        } else if (!newActive && newActive !== oldActive) {
            img.classList.remove('active');
            a.classList.remove('active');
        }
    };

    /**
     * A utility function that sets the active CSS class for the parent of a given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } newActive
     * @param { !Boolean } oldActive
     */
    const setParentActiveCSSClass = (hash, newActive, oldActive) => {
        const rootParent = getRootParentNode(hash);
        if (null !== rootParent) {
            const idPrefix = rootParent.getHash().slice(1);
            setActiveCSSClass(rootParent.getHash(), newActive, oldActive)
            const overviewRootNode = findElementById(overviewContentWrapper, idPrefix+'-overview-node');
            const overviewIcon = overviewRootNode.getElementsByTagName('img')[0];
            toggleCSSClass(overviewIcon, 'active', newActive);
        }
    };

    /**
     * A utility function the returns the root parent node for a given hash.
     *
     * @function
     * @param { String } hash
     * @return { ?PageControllerType }
     */
    const getRootParentNode = hash => {
        const pageController = controller.getPageController(hash);
        let parentNode = pageController.getParent();
        while (null !== parentNode && null !== parentNode.getParent()) {
            parentNode = parentNode.getParent();
        }
        return parentNode;
    };

    /**
     * A utility function that adds or removes a CSS class to an element based on a given condition.
     *
     * @function
     * @param { HTMLElement } element
     * @param { String } cssClass
     * @param { Boolean } condition
     * @return { void }
     */
    const toggleCSSClass = (element, cssClass, condition) => {
        if (condition) {
            element.classList.add(cssClass);
        } else {
            element.classList.remove(cssClass);
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
     * A utility function that sets the icon source for the given hash to newIcon.
     *
     * @function
     * @param { !PageControllerType } pageController
     * @param { !String } newIcon
     */
    const setIconSource = (pageController, newIcon) => {
        const idPrefix = pageController.getHash().slice(1);
        const overviewIcon = findElementById(overviewContentWrapper, idPrefix + '-overview-icon');
        const detailIcon   = findElementById(tree, idPrefix + '-detail-icon');
        if (null === pageController.getParent() && null !== overviewIcon && null !== detailIcon) {
            overviewIcon.src = newIcon;
            detailIcon.src = newIcon;
        } else if (null !== detailIcon) {
            detailIcon.src = './navigation/icons/line.png';
        }
    }

    const handleVisibleChange = (hash, isVisible) => {
        console.log(hash)
        const idPrefix = hash.slice(1);
        const overviewNode = findElementById(overviewContentWrapper, idPrefix + '-overview-node');
        const detailNode   = findElementById(tree, idPrefix + '-node');
        if (null !== overviewNode) {
            toggleCSSClass(overviewNode, 'invisible', !isVisible);
        }
        if (null !== detailNode) {
            toggleCSSClass(detailNode, 'invisible', !isVisible);
        }
    }
};
