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
 * @param   { NavigationControllerType } controller - the controller that is connected to the model
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
    styles.href = './navigation/bubble_state_navigation/navigationProjector.css';
    head.appendChild(styles);

    const projectNavigation = () => {
        const nav       = document.getElementById('nav');
        const div       = document.createElement('div');
        const ul        = document.createElement('ul');
        const indicator = document.createElement('div');

        div.classList.add('navigation');
        indicator.classList.add('indicator');

        nav.innerHTML = '';
        for(const item of controller.getNavigationPoints()) {
            const li   = document.createElement('li');
            const a    = document.createElement('a');
            const icon = document.createElement('span');
            const img  = document.createElement('img');
            const text = document.createElement('span');

            li.classList.add('list');

            li.id = item;
            a.setAttribute('href', '#' + item);
            icon.classList.add('icon');
            img.classList.add('icon');
            text.classList.add('text');
            text.innerText = item;


            /*
             * Prevent the default behaviour of click events for a tags that represent navigation points
             * and pass the newly selected location to the controller
             */
            a.onclick = e => {
                e.preventDefault(); // Prevent hash change by clicking on anchor tag
                const newLocation = e.currentTarget.getAttribute("href");
                controller.setLocation(newLocation);
            };

            icon.append(img);
            a.append(icon);
            a.append(text);
            li.append(a);
            ul.appendChild(li);
        }
        ul.append(indicator);
        div.append(ul);
        nav.appendChild(div);
    };

    /**
     * Change the newly selected navigation point in the navigation bar
     *
     * @param { !String } newLocation - the newly selected location from the model
     *
     */
    const changeSelectedNavigationPoint = newLocation => {
        if (!!newLocation) {
            const newLocationTag = document.getElementById(newLocation);
            const innerList = document.querySelectorAll('.list');
            innerList.forEach(item =>
                item.classList.remove('active')
            );
            newLocationTag.classList.add('active');
        }
    };

    controller.addModelChangeListener(navEvent => {
        if (navEvent.getEventType() === EventType.NAVBAR_CHANGE) projectNavigation();
        if (navEvent.getEventType() === EventType.PAGE_CHANGE) {
            const pageContent = controller.getPageContent(navEvent.getValue());
            changeSelectedNavigationPoint(navEvent.getValue());
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