import {
    ACTIVE,
    HASH,
    ICON,
    IS_HOMEPAGE,
    NAVIGATIONAL,
    PARENT,
    VALUE,
    VISIBLE,
    VISITED
} from "../kolibri/presentationModel.js";
import { PageModel } from "./pageModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 * @template T
 * @typedef PageControllerType
 * @property { () => void } activate
 * @property { () => void } passivate
 * @property { () => [T] } getPageContentControllers
 * @property { () => String } getValue
 * @property { () => String } getHash
 * @property { (iconPathOrName: String) => void } setIcon
 * @property { (visitedState: Boolean) => void } setVisited
 * @property { (isHomepage: Boolean) => void } setIsHomepage
 * @property { (isVisible: Boolean) => void } setIsVisible
 * @property { () => Boolean } getIsVisible
 * @property { (newParent: ?PageControllerType) => void } setParent - the newParent you want to set for the page, if null is set, the parent is root
 * @property { () => ?PageControllerType } getParent
 * @property { (isNavigational: Boolean) => void } setIsNavigational
 * @property { () => Boolean } getIsNavigational
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onValueChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsHomepageChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsNavigationalChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsVisibleChanged
 * @property { (callback: onValueChangeCallback<?PageControllerType>) => void } onParentChanged
 */

/**
 * Constructor for a PageControllerType.
 *
 * @template T
 * @constructor
 * @param { !String } pageName
 * @param { [T] } contentControllers
 * @returns  PageControllerType
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('house');
 */
const PageController = (pageName, contentControllers) => {
    const pageModel = PageModel(pageName);
    const pageContentControllers = contentControllers;

    return {
        getPageContentControllers: () => pageContentControllers,
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate: () => pageModel.getPageObs(ACTIVE).setValue(false),
        setParent: newParent => {
            if (null !== newParent) {
                let parent = newParent;
                let canAddParent = true;
                // iterate through all parents and check if thisNode is already a parent in the hierarchy
                while (null !== parent) {
                    if (parent.getValue() === pageName) {
                        console.error('Parent of a node cannot be a child of a node or the node itself.');
                        canAddParent = false;
                        break;
                    }
                    parent = parent.getParent();
                }
                if (canAddParent) {
                    pageModel.getPageObs(PARENT).setValue(newParent);
                }
            } else {
                // allow null as parent
                pageModel.getPageObs(PARENT).setValue(newParent);
            }
        },
        getValue:                pageModel.getPageObs(VALUE).getValue,
        getHash:                 pageModel.getPageObs(HASH).getValue,
        setIcon:                 pageModel.getPageObs(ICON).setValue,
        setVisited:              pageModel.getPageObs(VISITED).setValue,
        setIsHomepage:           pageModel.getPageObs(IS_HOMEPAGE).setValue,
        setIsVisible:            pageModel.getPageObs(VISIBLE).setValue,
        getIsVisible:            pageModel.getPageObs(VISIBLE).getValue,
        setIsNavigational:       pageModel.getPageObs(NAVIGATIONAL).setValue,
        getIsNavigational:       pageModel.getPageObs(NAVIGATIONAL).getValue,
        getParent:               pageModel.getPageObs(PARENT).getValue,
        onActiveChanged:         pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:           pageModel.getPageObs(ICON).onChange,
        onVisitedChanged:        pageModel.getPageObs(VISITED).onChange,
        onValueChanged:          pageModel.getPageObs(VALUE).onChange,
        onIsHomepageChanged:     pageModel.getPageObs(IS_HOMEPAGE).onChange,
        onIsNavigationalChanged: pageModel.getPageObs(NAVIGATIONAL).onChange,
        onIsVisibleChanged:      pageModel.getPageObs(VISIBLE).onChange,
        onParentChanged:         pageModel.getPageObs(PARENT).onChange,
        // more to come...
    }
};