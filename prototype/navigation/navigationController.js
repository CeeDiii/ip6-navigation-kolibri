import {Attribute, HASH, PARENT, VALUE, valueOf} from "../kolibri/presentationModel.js";
import { NavigationModel } from "./navigationModel.js";

export { NavigationController }

/**
 * NavigationControllerType is a Controller that coordinates communication between Model and Projector.
 * The controller handles the routing triggered by the registered anchor elements.
 * The controller passes the website logo path, the homepage, the websites name and the page controllers to the {@link NavigationModel}.
 *
 * @typedef NavigationControllerType
 * @property { (pageControllersToAdd: PageControllerType[]) => void } addPageControllers          - a function that adds one or more page controllers to the navigation controller and adds the page hash to the {@link NavigationModel}.
 * @property { (pageHash: String) => PageControllerType }             getPageController           - a function that returns the page controller of a specific hash.
 * @property { (pageHash: String) => void }                           deletePageController        - a function that deletes the page controller of a specific hash.
 * @property { (anchor: HTMLAnchorElement) => void }                  registerAnchorClickListener - a function that registers a click listener on an anchor. this binding triggers a location change trough navigate based on the hash the anchor has.
 * @property { (setConfObj: Object) => void }       setConfiguration - a function that sets the attributes of this navigation for all keys in object to their value.
 * @property { (newHomepage: String) => void }      setHomePage      - a function that sets the homepage in the {@link NavigationModel}. the homepage is the fallback page which gets opened when no hash is provided in the request url.
 * @property { () => String}                        getHomePage      - a function that returns the hash of the homepage.
 * @property { (name: String) => void }             setWebsiteName   - a function that sets the name for the website in the {@link NavigationModel}
 * @property { (logoSrcPath: String) => void }      setWebsiteLogo   - a function that sets the path for the logo that can be displayed in the navigation in the {@link NavigationModel}
 * @property { (favIconSrcPath: String) => void }   setFavIcon       - a function that sets the favicon, calling all registered {@link onValueChangeCallback}s.
 * @property { (debugModeActive: Boolean) => void } setDebugMode     - a function that sets the debug mode active state. calling all registered {@link onValueChangeCallback}s.
 * @property { () => Boolean }                      isDebugMode      - a function that returns the if the debug mode is active.
 * @property { (callback: observableListCallback) => Boolean }                 onNavigationHashAdd  - a function that registers an {@link observableListCallback} that will be called whenever a page hash is added.
 * @property { (callback: observableListCallback) => Boolean }                 onNavigationHashDel  - a function that registers an {@link observableListCallback} that will be called whenever a page hash is deleted.
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onLocationChanged    - a function that registers an {@link onValueChangeCallback} that will be called whenever the current location is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onWebsiteNameChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page name is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onWebsiteLogoChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page logo is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onFavIconChanged     - a function that registers an {@link onValueChangeCallback} that will be called whenever the favicon is changed.
 * @property { (callback: onValueChangeCallback<Boolean>) => void }            onVisibleChanged     - a function that registers an {@link onValueChangeCallback} that will be called whenever a pages visibility is changed.
 * @property { (callback: onValueChangeCallback<Boolean>) => void }            onDebugModeChanged   - a function that registers an {@link onValueChangeCallback} that will be called whenever the debug mode active state is changed.
 */

/**
 * Constructor for a NavigationControllerType
 * @return  { NavigationControllerType }
 * @constructor
 * @example
 * const navigationController = NavigationController();
 * navigationController.setWebsiteName('Kolibri');
 * navigationController.setWebsiteLogo('./img/logo/logo-new-128.svg');
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
            if(null === hash) return; // return if fallback homepage is not defined
        }

        window.location.hash = hash;
        const newLocation = getRoutingLocation(hash);

        // on initialization the currentLocation can be null and therefore not passivated
        if (valueOf(currentLocation) !== null) {
            valueOf(currentLocation).passivate();
        }

        newLocation.activate();
        currentLocation.getObs(VALUE).setValue(newLocation);

        if (navigationModel.isDebugMode()) {
            const debugController = pageControllers['#debug'];
            debugController.setParent(newLocation);
        }
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

        if(newLocation === undefined) { // if newLocation is undefined, navigate to an error page
            newLocation = pageControllers['#E404'];

        } else if (!newLocation.isNavigational()) { // if the newLocation exists but is not navigational we return a 403 forbidden error
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

    return {
        addPageControllers: pageControllersToAdd => {
            for (const pageController of pageControllersToAdd) {
                if (pageController && pageControllers[pageController.getHash()] === undefined) {
                    const hash = pageController.getHash();
                    pageControllers[hash] = pageController;
                    navigationModel.addNavigationHash(hash);
                }
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
        setConfiguration: confObj => {
            for (const [key, value] of Object.entries(confObj)) {
                if (HASH === key){
                    console.error('You cannot change that hash');
                } else if (PARENT === key){
                    console.error('You can only call setParent() after this PageController has successfully been added to the NavigationController');
                } else {
                    navigationModel.getNavObs(key).setValue(value);
                }
            }
        },
        setWebsiteName:         navigationModel.setWebsiteName,
        setWebsiteLogo:         navigationModel.setWebsiteLogo,
        setFavIcon:             navigationModel.setFavIcon,
        setHomePage:            navigationModel.setHomepage,
        getHomePage:            navigationModel.getHomepage,
        setDebugMode:           navigationModel.setDebugMode,
        isDebugMode:            navigationModel.isDebugMode,
        onNavigationHashAdd:    navigationModel.onAdd,
        onNavigationHashDel:    navigationModel.onDel,
        onLocationChanged:      currentLocation.getObs(VALUE).onChange,
        onWebsiteNameChanged:   navigationModel.onWebsiteNameChanged,
        onWebsiteLogoChanged:   navigationModel.onWebsiteLogoChanged,
        onFavIconChanged:       navigationModel.onFavIconChanged,
        onDebugModeChanged:     navigationModel.onDebugModeChanged,
        onVisibleChanged:       navigationModel.onVisibleChanged,
    }
};
