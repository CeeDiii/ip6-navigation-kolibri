import { EventType } from "./EventType.js";

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
    styles.href = './navigation/navigationProjector.css';
    head.appendChild(styles);

    const projectNavigation = () => {
        const nav = document.getElementById('nav');
        const ul = document.createElement('ul');
        nav.innerHTML = '';
        for(const item of controller.getNavigationPoints()) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', '#' + item);
            a.innerText = item;
            li.appendChild(a);
            ul.appendChild(li);
        }
        nav.appendChild(ul);
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