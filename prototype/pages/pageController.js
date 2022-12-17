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
 * PageControllerType is a controller for PageModelTypes.
 * It coordinates the state of the PageModelType and communicates changes to the PageProjectorTypes that are bound to the PageModelType and external observers.
 * The PageControllerType is responsible for the lifecycle handling of a PageModelType.
 *
 * @template T
 * @typedef PageControllerType
 * @property { () => void } activate - a lifecycle function that allows a page to do initialization before displaying. this function will be called by a NavigationController on activation of this page.
 * @property { () => void } passivate - a lifecycle function that allows page to clean up before removing it from displaying. this function will be called by a NavigationController on passivation of this page.
 * @property { () => ?[T] } getPageContentControllers - a getter function that returns the controllers that are responsible for the content of this page or null.
 * @property { (newValue: String) => void } setValue - a setter function that sets the newValue of the page.
 * @property { () => String } getValue - a getter function that returns the value of the page.
 * @property { () => String } getHash - a getter function that returns the hash of the page.
 * @property { (iconPathOrName: String) => void } setIcon - a setter function that sets the newValue of the page.
 * @property { (visitedState: Boolean) => void } setVisited - a setter function that sets the visitedState of the page.
 * @property { (isHomepage: Boolean) => void } setIsHomepage - a setter function that sets the isHomepage state of the page.
 * @property { (isVisible: Boolean) => void } setVisible - a setter function that sets the isVisible state of the page.
 * @property { () => Boolean } isVisible - a getter function that returns the isVisible state of the page.
 * @property { (newParent: ?PageControllerType) => void } setParent - a setter function that sets the newParent that is given, if null is set, the parent is root
 * @property { () => ?PageControllerType } getParent - a getter function that returns the parent of the page or null.
 * @property { (isNavigational: Boolean) => void } setNavigational - a setter function
 * @property { () => Boolean } isNavigational - a getter function that returns the isNavigational state of the page.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the active state changes.
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the icon changes.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the visited state changes.
 * @property { (callback: onValueChangeCallback<String>) => void } onValueChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the value changes.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsHomepageChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the isHomepage state changes.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onNavigationalChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the isNavigational state changes.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the isVisibile state changes.
 * @property { (callback: onValueChangeCallback<?PageControllerType>) => void } onParentChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the parent changes.
 */

/**
 * Constructor for a PageControllerType.
 *
 * @template T
 * @constructor
 * @param { !String } pageName - a name for page. the display name can be changed later, however the initial pageName must be unique as it will be set as the unchangeable hash that identifies the page. Mandatory
 * @param { [T] } contentControllers - the controllers that produce the dynamic content of this page.
 * @returns  PageControllerType
 * @example
 * const homePageController = PageController('home', null);
 * homePageController.setIcon('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
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
        setValue:                pageModel.getPageObs(VALUE).setValue,
        getValue:                pageModel.getPageObs(VALUE).getValue,
        getHash:                 pageModel.getPageObs(HASH).getValue,
        setIcon:                 pageModel.getPageObs(ICON).setValue,
        setVisited:              pageModel.getPageObs(VISITED).setValue,
        setIsHomepage:           pageModel.getPageObs(IS_HOMEPAGE).setValue, // has to be IsHomepage because we need to differentiate between the homepage value and isHomepage bool
        setVisible:              pageModel.getPageObs(VISIBLE).setValue,
        isVisible:               pageModel.getPageObs(VISIBLE).getValue,
        setNavigational:         pageModel.getPageObs(NAVIGATIONAL).setValue,
        isNavigational:          pageModel.getPageObs(NAVIGATIONAL).getValue,
        getParent:               pageModel.getPageObs(PARENT).getValue,
        onActiveChanged:         pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:           pageModel.getPageObs(ICON).onChange,
        onVisitedChanged:        pageModel.getPageObs(VISITED).onChange,
        onValueChanged:          pageModel.getPageObs(VALUE).onChange,
        onIsHomepageChanged:     pageModel.getPageObs(IS_HOMEPAGE).onChange,
        onNavigationalChanged:   pageModel.getPageObs(NAVIGATIONAL).onChange,
        onVisibleChanged:        pageModel.getPageObs(VISIBLE).onChange,
        onParentChanged:         pageModel.getPageObs(PARENT).onChange,
    }
};