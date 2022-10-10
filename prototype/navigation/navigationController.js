import { ACTIVE, Attribute, VALUE, valueOf } from "../kolibri/presentationModel.js";

export { NavigationController }

/**
 * Controller that coordinates communication between model and projector
 *
 * @typedef NavigationControllerType
 * @property { (pageController: PageControllerType) => Boolean } addPageController
 * @property { (pageHash: String) => Boolean } deletePageController
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashAdd
 * @property { (callback: observableListCallback) => Boolean } onNavigationHashDel
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onLocationChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onWebsiteLogoChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged
 * @property { (anchor: HTMLAnchorElement) => void } registerAnchorClickListener
 */

/**
 * @constructor
 * @param   { !NavigationModelType } model - the navigation model this controller coordinates
 * @return  { NavigationControllerType }
 * @example
 */
const NavigationController = model => { //TODO generate model within controller
    const navigationModel = model;
    const currentLocation = Attribute(null);

    return {
        addPageController: pageController => navigationModel.addPageController(pageController),
        deletePageController: pageController => navigationModel.deletePageController(pageController),
        onNavigationHashAdd: navigationModel.onAdd,
        onNavigationHashDel: navigationModel.onDel,
        onLocationChanged: currentLocation.getObs(VALUE).onChange,
        onWebsiteLogoChanged: navigationModel.onWebsiteLogoChanged,
        onVisibleChanged: navigationModel.onVisibleChanged,
        registerAnchorClickListener: anchor => {
            anchor.onclick(e => {
                const hash = e.currentTarget.getAttribute('href');
                e.preventDefault();
                const newLocation = navigationModel.getPageController(hash);
                newLocation.activate();
                valueOf(currentLocation).passivate();
                currentLocation.getObs(VALUE).setValue(newLocation);
            });
        }
    }
};