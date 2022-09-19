import { EventType } from "../EventType.js";

export { NavigationProjector }

/**
 * Projector that projects navigation data to a view
 *
 * @typedef NavigationProjectorType
 * @property { () => void } projectNavigation - project the navigation data to a view
 */

/**
 * @constructor
 * @param   { !NavigationControllerType } controller - the controller that is connected to the model
 * @return  { NavigationProjectorType }
 * @example
 * const navigationModel = NavigationModel('home');
 * const navigationController = NavigationController(navigationModel);
 * const navigationProjector = NavigationProjector(navigationController);
 * navigationProjector.projectNavigation();
 */
const NavigationProjector = controller => {

    const head = document.getElementsByTagName('head')[0];
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = './navigation/basic_navigation/navigationProjector.css';
    head.appendChild(styles);


    const projectNavigation = () => {
        const nav = document.getElementById('nav');
        const div = document.createElement('div');
        const ul  = document.createElement('ul');

        div.classList.add('navigation');

        nav.innerHTML = '';
        for(const item of controller.getNavigationPoints()) {
            const li   = document.createElement('li');
            const a    = document.createElement('a');
            const icon = document.createElement('span');
            const img  = document.createElement('img');
            const text = document.createElement('span');

            li.classList.add('list');
            if(window.location.hash === '#' + item) {
                li.classList.add('active')
            }
            li.id = item;
            a.setAttribute('href', '#' + item);
            icon.classList.add('icon');
            img.classList.add('icon');
            text.classList.add('text');
            text.innerText = item;

            icon.append(img);
            a.append(icon);
            a.append(text);
            li.append(a);
            ul.appendChild(li);
        }
        div.append(ul);
        nav.appendChild(div);

        window.addEventListener("hashchange", changeLocation, false);

        function changeLocation() {
            const newLocation = document.getElementById(window.location.hash.slice(1));
            if (!!newLocation) {
                const innerList = document.querySelectorAll('.list');
                innerList.forEach((item) =>
                    item.classList.remove('active')
                );
                newLocation.classList.add('active');
            }
        }
    }

    controller.addModelChangeListener((navEvent) => {
        if (navEvent.getEventType() === EventType.NAVBAR_CHANGE) projectNavigation();
        if (navEvent.getEventType() === EventType.PAGE_CHANGE) {
            const pageContent = controller.getPageContent(navEvent.getValue());
            if(pageContent !== undefined) {
                const oldContent = document.getElementById('content-wrapper');
                document.getElementById('content').replaceChild(pageContent, oldContent);
            }
        }
    });

    return {
        projectNavigation
    }
}