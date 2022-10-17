import { Attribute, VALUE, valueOf } from "../kolibri/presentationModel.js";
import { NavigationModel } from "./navigationModel.js";
import {PageController} from "../pages/pageController.js";
import {PageNotFoundProjector} from "../pages/404/pageNotFoundProjector.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @property { (pageController: PageControllerType) => Boolean } addPageController
 * @property { (pageHash: String) => PageControllerType } getPageController
 * @property { (pageHash: String) => void } deletePageController
 * @property { (newHomepage: String) => void } setHomePage
 * @property { () => String} getHomePage
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashAdd
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashDel
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onLocationChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onWebsiteLogoChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged
 * @property { (anchor: HTMLAnchorElement) => void } registerAnchorClickListener
 */

/**
 * @constructor
 * @return  { NavigationControllerType }
 * @example
 * const navigationController = NavigationController();
 */
const NavigationController = () => {
    const navigationModel = NavigationModel();
    const currentLocation = Attribute(null);
    const pageControllers = {};

    const navigate = hash => {
        // check if hash is empty to redirect to fallback homepage
        if(hash === '' || hash === '#') {
            hash = '#' + navigationModel.getHomepage();
            if(hash === '#') return; // return if fallback homepage is not defined
        }

        window.location.hash = hash;
        const newLocation = pageControllers[hash];

        // on initialization the currentLocation can be null and therefore not passivated
        if (valueOf(currentLocation) !== null) {
            valueOf(currentLocation).passivate();
        }

        // if newLocation is undefined, navigate to an error page
        if(newLocation === undefined) {
            const errorController = PageController("pagenotfound", null);
            PageNotFoundProjector(errorController).projectPage();
        } else {
            // otherwise activate newLocation and display the page
            newLocation.activate();
            currentLocation.getObs(VALUE).setValue(newLocation);
        }
    };

    // handles navigation through the browser URL field
    window.onhashchange = () => {
        const hash = window.location.hash;
        if (hash !== valueOf(currentLocation).getHash()) {
            navigate(hash);
        }
    };

    // handles initial page load and page reload
    window.onload = () => {
        const hash = window.location.hash;
        navigate(hash);
    };

    /**
     * This function handles all bindings to the pageController
     *
     * @function
     * @param { PageControllerType } pageController
     * @return { void }
     **/
    const bindPage = pageController => {
        pageController.onIsHomepageChanged(isHomepage => {
            if(isHomepage) navigationModel.setHomepage(pageController.getHash());
        });
    };

    return {
        addPageController: pageController => {
            if (pageController && pageControllers[pageController.getHash()] === undefined) {
                bindPage(pageController);
                const hash = pageController.getHash();
                pageControllers[hash] = pageController;
                navigationModel.addPageController(hash);
                return true;
            } else {
                return false;
            }
        },
        getPageController: pageHash => pageControllers[pageHash],
        deletePageController: pageHash => {
            navigationModel.deletePageController(pageHash);
            delete pageControllers[pageHash];
        },
        setHomePage: newHomepage => navigationModel.setHomepage(newHomepage),
        getHomePage: () => navigationModel.getHomepage(),
        onNavigationHashAdd:  navigationModel.onAdd,
        onNavigationHashDel:  navigationModel.onDel,
        onLocationChanged:    currentLocation.getObs(VALUE).onChange,
        onWebsiteLogoChanged: navigationModel.onWebsiteLogoChanged,
        onVisibleChanged:     navigationModel.onVisibleChanged,
        registerAnchorClickListener: anchor => {
            anchor.onclick = e => {
                e.preventDefault();
                const hash = e.currentTarget.getAttribute('href');
                navigate(hash);
            };
        }
    }
};