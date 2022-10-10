import { Attribute, valueOf, LOGO, VISIBLE } from "../kolibri/presentationModel.js";
import { ObservableList } from "../kolibri/observable.js";

export { NavigationModel }

/**
 * Model containing the application navigation-data
 *
 * @typedef NavigationModelType
 * @property { (pageController: PageControllerType) => Boolean } addPageController
 * @property { (pageHash: String) => PageControllerType } getPageController
 * @property { (pageHash: String) => Boolean } deletePageController
 * @property { (callback: observableListCallback) => Boolean } onAdd
 * @property { (callback: observableListCallback) => Boolean } onDel
 * @property { (callback: onValueChangeCallback<String>) => void } onWebsiteLogoChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged
 */

/** 
 * @constructor
 * @return { NavigationModelType }
 * @example
 */

const NavigationModel = () => {
    const navigationHashes = Attribute(ObservableList([]));
    const pageControllers = {};

    return {
        addPageController: pageController => {
            const hash = pageController.getHash();
            if(valueOf(navigationHashes)[hash] === undefined) {
                valueOf(navigationHashes).add(hash);
                pageControllers[hash] = pageController;
                return true;
            } else {
                return false;
            }
        },
        getPageController: pageHash => pageControllers[pageHash],
        deletePageController: pageHash => {
            valueOf(navigationHashes).del(pageHash);
            return delete pageControllers[pageHash];
        },
        onAdd: valueOf(navigationHashes).onAdd,
        onDel: valueOf(navigationHashes).onDel,
        onWebsiteLogoChanged: navigationHashes.getObs(LOGO).onChange,
        onVisibleChanged: navigationHashes.getObs(VISIBLE).onChange,
    }
};
