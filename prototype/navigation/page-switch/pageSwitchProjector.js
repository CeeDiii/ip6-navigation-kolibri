import { ObservableList } from "../../kolibri/observable.js";
import { dom } from "../../kolibri/util/dom.js";

export { PageSwitchProjector }

/**
 * @typedef NavigationProjectorType
 * @property { (exampleDiv: !HTMLDivElement) => void } projectNavigation
 */

/**
 * @constructor
 * @param { !String } hash
 * @param { !NavigationControllerType } navigationController
 * @param { !String } gistID
 * @return { NavigationProjectorType }
 */
const PageSwitchProjector = (hash, navigationController, gistID) => {
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];


    function loadGist(codeDiv, gistId) {
        //REF: http://stackoverflow.com/a/16178339
        const callbackName = "gist_callback"; // Create individual callbacks for each gist
        window[callbackName] = function (gistData) {
            delete window[callbackName];
            let html = '';
            html += gistData.div;
            codeDiv.innerHTML = html;
        };
        const script = document.createElement("script");
        script.setAttribute("src", "https://gist.github.com/" + gistId + ".json?callback=" + callbackName);
        document.body.appendChild(script);
    }

    const setActiveCSSClassOnSwitch = path => {
        if (null !== path && path.includes(hash)) {
            if (0 !== navigationAnchors.length && path.includes('/code')) {
                const [exampleAnchor, codeAnchor] = navigationAnchors;
                codeAnchor.classList.add('active');
                exampleAnchor.classList.remove('active');
                const navDiv = document.getElementsByClassName('ensemble-navigation')[0];
                if (undefined !== navDiv) {
                    navDiv.classList.add('active');
                }

            } else if (0 !== navigationAnchors.length) {
                const [exampleAnchor, codeAnchor] = navigationAnchors;
                exampleAnchor.classList.add('active');
                codeAnchor.classList.remove('active');
                const navDiv = document.getElementsByClassName('ensemble-navigation')[0];
                if (undefined !== navDiv) {
                    navDiv.classList.remove('active');
                }
            }
        }
    };

    const toggleSwitch = path => {
        if (null !== path && path.includes(hash)) {
            if (0 !== navigationAnchors.length && path.includes('/code')) {
                const codeDiv = document.getElementsByClassName('code')[0];
                const exampleDiv = document.getElementsByClassName('example')[0];
                if (undefined !== codeDiv && undefined !== exampleDiv) {
                    exampleDiv.classList.add('invisible');
                    codeDiv.classList.remove('invisible');
                }
            } else if (0 !== navigationAnchors.length) {
                const codeDiv = document.getElementsByClassName('code')[0];
                const exampleDiv = document.getElementsByClassName('example')[0];
                if (undefined !== codeDiv && undefined !== exampleDiv) {
                    codeDiv.classList.add('invisible');
                    exampleDiv.classList.remove('invisible');
                }
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
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @param { !HTMLDivElement } exampleDiv     - a div with the projection of a running example. Mandatory.
     * @return HTMLDivElement
     */
    const projectNavigation = exampleDiv => {
        if (0 === navigationAnchors.length) {
            const [exampleAnchor, codeAnchor] = initializeNavigationPoint();
            observableNavigationAnchors.add(exampleAnchor);
            observableNavigationAnchors.add(codeAnchor);
        }
        const [exampleAnchor, codeAnchor] = navigationAnchors;

        const [switchDiv, navDiv, contentDiv, codeDiv] = dom(`
            <div class="switch-nav"></div>
            <div class="ensemble-navigation"></div>
            <div class="ensemble-content"></div>
            <div class="code gistEmbed" data-gist-id="${gistID}"></div>
        `);

        exampleDiv.classList.add('example');

        const currentPath = navigationController.getPath();
        if (currentPath.includes('/code')) {
            codeAnchor.classList.add('active');
            navDiv.classList.add('active');
            exampleDiv.classList.add('invisible');
        } else {
            exampleAnchor.classList.add('active');
            codeDiv.classList.add('invisible');
        }

        loadGist(codeDiv, gistID);

        contentDiv.append(exampleDiv, codeDiv);
        navDiv.append(exampleAnchor, codeAnchor);
        switchDiv.append(navDiv, contentDiv);

        return switchDiv;
    };

    observableNavigationAnchors.onAdd(anchor => {
        navigationController.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    navigationController.onPathChanged(newPath => {
        setActiveCSSClassOnSwitch(newPath);
        toggleSwitch(newPath);
    });

    return {
        projectNavigation
    };
};
