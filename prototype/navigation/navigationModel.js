import { Attribute, valueOf, NAME, LOGO, VISIBLE } from "../kolibri/presentationModel.js";
import { ObservableList } from "../kolibri/observable.js";

export { NavigationModel }

/**
 * NavigationModelType is the Model that contains the navigation-data from the application.
 * The model holds the page hashes of the accessible pages, the homepage, the websites name and the website logo.
 * @typedef NavigationModelType
 * @property { (pageHash: String) => void } addNavigationHash - a function that adds the hash of a page, calling all registered {@link observableListCallback}s.
 * @property { (pageHash: String) => void } deleteNavigationHash - a function that deletes the hash of a page, calling all registered {@link observableListCallback}s.
 * @property { () => String } getHomepage - a function that returns the hash of the homepage.
 * @property { (newHomepage: String) => void } setHomepage - a function that sets the homepage. the homepage is the fallback page which gets opened when no hash is provided in the request url.
 * @property { (callback: observableListCallback) => Boolean } onAdd - a function that registers an {@link observableListCallback} that will be called whenever a page hash is added.
 * @property { (callback: observableListCallback) => Boolean } onDel - a function that registers an {@link observableListCallback} that will be called whenever a page hash is deleted.
 * @property { (name: String) => void } setWebsiteName - a function that sets the name for the website, calling all registered {@link onValueChangeCallback}s.
 * @property { (logoSrcPath: String) => void } setWebsiteLogo - a function that sets the path for the page logo that can be displayed in the navigation, calling all registered {@link onValueChangeCallback}s.
 * @property { (callback: onValueChangeCallback<String>)  => void } onWebsiteNameChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page name is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void } onWebsiteLogoChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page logo is changed.
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisibleChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever a pages visibility is changed.
 */

/**
 * Constructor for a NavigationModelType.
 * @return { NavigationModelType }
 * @constructor
 * @example
 * const navigationModel = NavigationModel();
 * navigationModel.onWebsiteNameChanged(val => console.log(val));
 * navigationModel.setWebsiteName("new website name");
 */

const NavigationModel = () => {
    const navigationHashes = Attribute(ObservableList([]));

    // homepage stores the hash of the homepage
    let homepage = '#';

    return {
        addNavigationHash: pageHash => {
            valueOf(navigationHashes).add(pageHash);
        },
        deleteNavigationHash: pageHash => {
            valueOf(navigationHashes).del(pageHash);
        },
        getHomepage: ()          => homepage,
        setHomepage: newHomepage => homepage = newHomepage,
        onAdd: valueOf(navigationHashes).onAdd,
        onDel: valueOf(navigationHashes).onDel,
        setWebsiteName: name        =>  navigationHashes.getObs(NAME).setValue(name),
        setWebsiteLogo: logoSrcPath =>  navigationHashes.getObs(LOGO).setValue(logoSrcPath),
        onWebsiteNameChanged: navigationHashes.getObs(NAME).onChange,
        onWebsiteLogoChanged: navigationHashes.getObs(LOGO).onChange,
        onVisibleChanged:     navigationHashes.getObs(VISIBLE).onChange,
    }
};
