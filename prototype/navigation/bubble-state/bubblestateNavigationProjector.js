import { ObservableList } from "../../kolibri/observable.js";
import {dom} from "../../kolibri/util/dom.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @return { NavigationProjectorType }
 * @example
 * TODO
 */


const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];
    const anchorListWrappers = {};

    const projectNavigation = () => {
        const navigation = dom(`
            <div id="bubbleStateWrapper" class="navigation">
                <ul id="bubbleStateNavPointWrapper">
                    <!-- Placeholder for navigation li elements and indicator -->
                </ul>
            </div>
        `);

        navigationAnchors.forEach(anchor => {
            const navigationPointName = anchor.href.substring(anchor.href.indexOf("#") + 1);

            anchor.innerHTML = `
                <span class="icon">
                    <img class="icon">
                </span>
                <span class="text">${navigationPointName}</span>
            `;

            const navPoint = dom(`
                <li class="list" id="${navigationPointName}">
                </li>
        `   );

            navPoint[navigationPointName].append(anchor);
            anchorListWrappers[navigationPointName] = navPoint[0];
            navigation["bubbleStateWrapper"].children["bubbleStateNavPointWrapper"].append(...navPoint);
        });
        const indicator = dom(`<div class="indicator"></div>`);
        navigation["bubbleStateWrapper"].children["bubbleStateNavPointWrapper"].append(...indicator);
        pinToElement.replaceChildren(...navigation);
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const newNavPoint = document.createElement('a');
        newNavPoint.setAttribute('href', hash);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS TO MODEL
        controller.getPageController(hash).onVisitedChanged(visited => {
            if (visited) {
                const anchor = navigationAnchors.find(/** HTMLAnchorElement */ a => {
                    const urlHash = a.href.substring(a.href.indexOf("#"));
                    return urlHash === hash;
                });
                if (anchor !== undefined) {
                    anchor.classList.add("visited");
                }
            }
        });

        controller.getPageController(hash).onActiveChanged(active => {
            const pageName = hash.substring(1);
            if (active) {
                if (anchorListWrappers[pageName] !== undefined) {
                    anchorListWrappers[pageName].classList.add("active");
                }
            } else {
                if (anchorListWrappers[pageName] !== undefined) {
                    anchorListWrappers[pageName].classList.remove("active");
                }
            }
        });
        // END

        projectNavigation();
    });
};