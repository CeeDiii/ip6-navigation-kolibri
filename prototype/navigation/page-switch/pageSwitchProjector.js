import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { PageSwitchProjector }

/**
 * @typedef NavigationProjectorType
 * @property { (exampleDiv: !HTMLDivElement) => HTMLDivElement } projectNavigation - a function that returns a HtmlDivElement where the example and code switch is implemented.
 */

/**
 * @constructor
 * @param { !String } hash - the hash for which this PageSwitchProjector will project.
 * @param { !NavigationControllerType } navigationController - the navigation controller that controls the current path.
 * @param { !String } gistID - the GitHub GistID of the code that you want to show.
 * @return { NavigationProjectorType }
 */
const PageSwitchProjector = (hash, navigationController, gistID) => {
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    const [switchDiv, navDiv, contentDiv, codeDiv] = dom(`
            <div class="switch-nav"></div>
            <div class="ensemble-navigation"></div>
            <div class="ensemble-content"></div>
            <div class="code gistEmbed" data-gist-id="${gistID}"></div>
        `);

    /**
     * A function that creates a JSONP request for the given GitHub GistID.
     * The content will dynamically be fetched and rendered into the given codeDiv.
     *
     * JSONP is used to bypass CORS, for more details visit: https://en.wikipedia.org/wiki/JSONP.
     *
     * @param { !HTMLDivElement } codeDiv - the div that you want to render your gist in.
     * @param { !String } gistID - the gist id for the gist you want to render.
     */
    const loadGist = (codeDiv, gistID) => {
        // REF: http://stackoverflow.com/a/16178339
        const callbackName = "gist_callback";
        window[callbackName] = gistData => {
            delete window[callbackName];
            codeDiv.innerHTML = gistData['div'];
        };

        const script = document.createElement("script");
        script.setAttribute("src", "https://gist.github.com/" + gistID + ".json?callback=" + callbackName);
        document.body.appendChild(script);
    };

    /**
     * A function that adds a css class to elementStateActive
     * and removes it from the elementStateInactive.
     *
     * @param { !String } cssClass - the css class to toggle
     * @param { !HTMLDivElement } elementStateActive - the element where the class will be added
     * @param { !HTMLDivElement } elementStateInactive - the element where the class will be removed
     */
    const toggleState = (cssClass, elementStateActive, elementStateInactive) => {
        elementStateActive.classList.add(cssClass);
        elementStateInactive.classList.remove(cssClass);
    };

    /**
     * A function that switches between the example / code view. The displayed view is decided based on the given path.
     *
     * @param { !String } path - the path for which this toggle decides whether to switch or not.
     */
    const toggleSwitch = path => {
        const exampleDiv = document.getElementsByClassName('example')[0];
        if (null !== path && undefined !== exampleDiv && 2 === navigationAnchors.length) {
            const [exampleAnchor, codeAnchor] = navigationAnchors;
            if (path.includes(hash + '/code')) {
                toggleState('active', codeAnchor, exampleAnchor);
                toggleState('invisible', exampleDiv, codeDiv);
                navDiv.classList.add('active');
            } else {
                toggleState('active', exampleAnchor, codeAnchor);
                toggleState('invisible', codeDiv, exampleDiv);
                navDiv.classList.remove('active');
            }
        }
    };


    /**
     * Initializes the navigation anchors
     *
     * @function
     * @return { HTMLAnchorElement[] }
     *
     */
    const initializeNavigationPoint = () => {
        const [exampleAnchor, codeAnchor] = dom(`
            <a href="${hash}/example">Example</a>
            <a href="${hash}/code">Code</a>
        `);

        return [/** @type { HTMLAnchorElement } */ exampleAnchor, /** @type { HTMLAnchorElement } */ codeAnchor];
    };

    /**
     * A function that initializes the content of this navigation.
     *
     * @param { !HTMLDivElement } exampleDiv - the div where the example part of this code is rendered in.
     */
    const initializeNavigation = exampleDiv => {
        if (0 === navigationAnchors.length) {
            const [exampleAnchor, codeAnchor] = initializeNavigationPoint();
            observableNavigationAnchors.add(exampleAnchor);
            observableNavigationAnchors.add(codeAnchor);
        }
        const [exampleAnchor, codeAnchor] = navigationAnchors;

        exampleDiv.classList.add('example');

        loadGist(codeDiv, gistID);

        contentDiv.append(exampleDiv, codeDiv);
        navDiv.append(exampleAnchor, codeAnchor);
        switchDiv.append(navDiv, contentDiv);
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @param { !HTMLDivElement } exampleDiv  - a div with the projection of a running example. Mandatory.
     * @return { HTMLDivElement }
     */
    const projectNavigation = exampleDiv => {
        if (0 === switchDiv.children.length) {
            initializeNavigation(exampleDiv);
        }

        const [exampleAnchor, codeAnchor] = navigationAnchors;

        const currentPath = navigationController.getPath();
        if (currentPath.includes('/code')) {
            codeAnchor.classList.add('active');
            navDiv.classList.add('active');
            exampleDiv.classList.add('invisible');
        } else {
            exampleAnchor.classList.add('active');
            codeDiv.classList.add('invisible');
        }

        return /** @type HTMLDivElement */ switchDiv;
    };

    observableNavigationAnchors.onAdd(anchor => {
        navigationController.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    navigationController.onPathChanged(newPath => {
        toggleSwitch(newPath);
    });

    return {
        projectNavigation
    };
};
