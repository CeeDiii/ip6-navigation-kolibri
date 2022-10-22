import { Attribute, valueOf, LOGO, VISIBLE } from "../kolibri/presentationModel.js";
import { ObservableList } from "../kolibri/observable.js";

export { NavigationModel }

/**
 * Model containing the application navigation-data
 *
 * @typedef NavigationModelType
 * @property { (pageHash: String) => void } addNavigationHash
 * @property { (pageHash: String) => void } deleteNavigationHash
 * @property { () => String } getHomepage
 * @property { (newHomepage: String) => void } setHomepage
 * @property { (callback: observableListCallback) => Boolean } onAdd
 * @property { (callback: observableListCallback) => Boolean } onDel
 * @property { (callback: onValueChangeCallback<String>) => void } onWebsiteLogoChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged
 */

/** 
 * @constructor
 * @return { NavigationModelType }
 */

const NavigationModel = () => {
    const navigationHashes = Attribute(ObservableList([]));
    let homepage = '';


    return {
        addNavigationHash: pageHash => {
            valueOf(navigationHashes).add(pageHash);
        },
        deleteNavigationHash: pageHash => {
            valueOf(navigationHashes).del(pageHash);
        },
        getHomepage: () => homepage,
        setHomepage: newHomepage => homepage = newHomepage,
        onAdd: valueOf(navigationHashes).onAdd,
        onDel: valueOf(navigationHashes).onDel,
        onWebsiteLogoChanged: navigationHashes.getObs(LOGO).onChange,
        onVisibleChanged: navigationHashes.getObs(VISIBLE).onChange,
    }
};
