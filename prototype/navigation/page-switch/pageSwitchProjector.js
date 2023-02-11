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

    function loadAndEmbedGist(document, window) {
        document.addEventListener("DOMContentLoaded", function (event) {

            function forEach(array, callback, scope) {
                //REF: http://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
                for (let i = 0; i < array.length; i++) {
                    callback.call(scope, i, array[i]); // passes back stuff we need
                }
            };

            function loadGist(el, i, gistId) {
                //REF: http://stackoverflow.com/a/16178339
                const callbackName = "gist_callback" + i; // Create individual callbacks for each gist
                window[callbackName] = function (gistData) {
                    delete window[callbackName];
                    let html = '';
                    html += gistData.div;
                    el.innerHTML = html;
                };
                const script = document.createElement("script");
                script.setAttribute("src", "https://gist.github.com/" + gistId + ".json?callback=" + callbackName);
                document.body.appendChild(script);
            }

            // Haven't figured out the Callback function for Markdown
            setTimeout(function () {
                const gists = document.querySelectorAll('.gistEmbed');

                forEach(gists, function (i, element) {
                    console.log(element);

                    loadGist(element, i, element.dataset.gistId)
                });

            }, 300); //Might need to increas this time if it takes time to load
        });
    }



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

        contentDiv.append(exampleDiv, codeDiv);
        loadAndEmbedGist(document, window);
        navDiv.append(exampleAnchor, codeAnchor);
        switchDiv.append(navDiv, contentDiv);

        return switchDiv;
    };

    observableNavigationAnchors.onAdd(anchor => {
        navigationController.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    navigationController.onPathChanged(newPath => {
       console.log(newPath);
    });

    navigationController.getPageController(hash).onActiveChanged(active => {
        if (active) {
            loadAndEmbedGist(document, window);
        }
    });

    return {
        projectNavigation
    };
};
