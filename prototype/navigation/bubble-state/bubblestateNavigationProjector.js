import { ObservableList } from "../../kolibri/observable.js";

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
        const ul        = document.createElement('ul');
        const div       = document.createElement('div');
        const indicator = document.createElement('div');

        pinToElement.innerHTML = '';

        div.classList.add('navigation');
        indicator.classList.add('indicator');

        navigationAnchors.forEach(anchor => {
            const li   = document.createElement('li');
            const icon = document.createElement('span');
            const img  = document.createElement('img');
            const text = document.createElement('span');

            const navigationPointName = anchor.href.substring(anchor.href.indexOf("#") + 1);

            li.classList.add('list');
            li.id = navigationPointName;
            icon.classList.add('icon');
            img.classList.add('icon');
            text.classList.add('text');
            text.innerText = navigationPointName;

            anchorListWrappers[navigationPointName] = li;

            icon.append(img);
            anchor.innerHTML = '';
            anchor.append(icon);
            anchor.append(text);
            li.append(anchor);
            ul.appendChild(li);
        });

        ul.append(indicator);
        div.append(ul);
        pinToElement.append(div);
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