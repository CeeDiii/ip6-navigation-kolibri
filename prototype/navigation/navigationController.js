import { Attribute, VALUE, valueOf } from "../kolibri/presentationModel.js";
import { NavigationModel } from "./navigationModel.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @property { (pageController: PageControllerType) => Boolean } addPageController
 * @property { (errorKey: String, pageController: PageControllerType) => Boolean } addErrorPageController
 * @property { (pageHash: String) => PageControllerType } getPageController
 * @property { (pageHash: String) => void } deletePageController
 * @property { (newHomepage: String) => void } setHomePage
 * @property { () => String} getHomePage
 * @property { (name: String) => void } setWebsiteName
 * @property { (logoSrcPath: String) => void } setWebsiteLogo
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashAdd
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashDel
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onLocationChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onWebsiteNameChanged
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
    const navigationModel  = NavigationModel();
    const currentLocation  = Attribute(null);
    const pageControllers  = {};

    /**
     * A function that navigates to the route
     * that is found for a given hash.
     *
     * @function
     * @param { String } hash
     * @return { void }
     */
    const navigate = hash => {
        // check if hash is empty to redirect to fallback homepage
        if(hash === '' || hash === '#') {
            hash = navigationModel.getHomepage();
            if(hash === '#') return; // return if fallback homepage is not defined
        }

        window.location.hash = hash;
        const newLocation = getRoutingLocation(hash);

        // on initialization the currentLocation can be null and therefore not passivated
        if (valueOf(currentLocation) !== null) {
            valueOf(currentLocation).passivate();
        }

        newLocation.activate();
        currentLocation.getObs(VALUE).setValue(newLocation);
    };

    /**
     * A function that finds the correct route for a hash
     * and returns the corresponding pageController.
     *
     * @function
     * @param { String } hash
     * @return { PageControllerType }
     */
    const getRoutingLocation = hash => {
        /** @type { PageControllerType } */ let newLocation = pageControllers[hash];

        // if newLocation is undefined, navigate to an error page
        if(newLocation === undefined) {
            newLocation = pageControllers['#E404'];
        // if the newLocation exists but is not navigational we return a 403 forbidden error
        } else if (!newLocation.getIsNavigational()) {
            newLocation = pageControllers['#E403'];
        }
        return newLocation
    };

    // handles initial page load and page reload
    window.onload = () => {
        const hash = window.location.hash;
        navigate(hash);
    };

    // handles navigation through the browser URL field
    window.onhashchange = () => {
        const hash = window.location.hash;
        if (hash !== valueOf(currentLocation).getHash()) {
            navigate(hash);
        }
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
                navigationModel.addNavigationHash(hash);
                return true;
            } else {
                return false;
            }
        },
        addErrorPageController: (errorKey, pageController) => {
            if (pageController && pageControllers[pageController.getHash()] === undefined) {
                bindPage(pageController);
                pageControllers['#' + errorKey] = pageController;
                navigationModel.addNavigationHash('#' + errorKey);
                return true;
            } else {
                return false;
            }
        },
        getPageController: pageHash => pageControllers[pageHash],
        deletePageController: pageHash => {
            navigationModel.deleteNavigationHash(pageHash);
            delete pageControllers[pageHash];
        },
        registerAnchorClickListener: anchor => {
            anchor.onclick = e => {
                e.preventDefault();
                const hash = e.currentTarget.getAttribute('href');
                navigate(hash);
            };
        },
        setHomePage:            navigationModel.setHomepage,
        getHomePage:            navigationModel.getHomepage,
        setWebsiteName:         navigationModel.setWebsiteName,
        setWebsiteLogo:         navigationModel.setWebsiteLogo,
        onNavigationHashAdd:    navigationModel.onAdd,
        onNavigationHashDel:    navigationModel.onDel,
        onLocationChanged:      currentLocation.getObs(VALUE).onChange,
        onWebsiteNameChanged:   navigationModel.onWebsiteNameChanged,
        onWebsiteLogoChanged:   navigationModel.onWebsiteLogoChanged,
        onVisibleChanged:       navigationModel.onVisibleChanged,
    }
};
