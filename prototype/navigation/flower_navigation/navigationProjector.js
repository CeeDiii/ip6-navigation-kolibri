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
    styles.href = './navigation/flower_navigation/navigationProjector.css';
    head.appendChild(styles);


    const projectNavigation = () => {
        const nav = document.getElementById('nav');
        const div = document.createElement('div');
        const toggle = document.createElement('div');
        const img_menu  = document.createElement('img');

        let counter = 4;

        div.classList.add('navigation');
        toggle.classList.add('toggle');
        img_menu.classList.add('icon');
        toggle.append(img_menu);
        div.append(toggle);

        nav.innerHTML = '';
        for(const item of controller.getNavigationPoints()) {
            const span   = document.createElement('span');
            const a    = document.createElement('a');
            const img = document.createElement('img');

            span.id = item;
            span.style.cssText = '--i:' + counter + ';';
            a.classList.add('list');
            if(window.location.hash === '#' + item) {
                a.classList.add('active')
            }
            a.setAttribute('href', '#' + item);
            img.classList.add('icon');

            a.append(img);
            span.append(a);
            div.append(span);

            counter --;
        }
        nav.appendChild(div);

        toggle.addEventListener("click" , () => nav.classList.toggle("open"));

        window.addEventListener("hashchange", changeLocation, false);

        function changeLocation() {
            const newLocation = document.getElementById(window.location.hash.slice(1));
            if (!!newLocation) {
                const innerList = document.querySelectorAll('.list');
                innerList.forEach(item =>
                    item.classList.remove('active')
                );
                newLocation.getElementsByClassName('list')[0].classList.add('active');
            }
        }
    };

    controller.addModelChangeListener(navEvent => {
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
};