import { EventType }                                        from "./navigation/EventType.js";
import { NavigationModel }                                  from "./navigation/navigationModel.js";
import { NavigationController }                             from "./navigation/navigationController.js";
// import { NavigationProjector }                              from "./navigation/navigationProjector.js";
// --- Example Navigations ---
// import { NavigationProjector }                              from "./navigation/basic_navigation/navigationProjector.js";
// import { NavigationProjector }                              from "./navigation/dashboard_navigation/navigationProjector.js";
import { NavigationProjector }                              from "./navigation/bubble_state_navigation/navigationProjector.js";
// import { NavigationProjector }                              from "./navigation/flower_navigation/navigationProjector.js";
import { CarListController, CarSelectionController }        from "./pages/car/carController.js";
import { Car, carSelectionMold }                            from './pages/car/car.js';
import { PersonListController, PersonSelectionController }  from "./pages/person/personController.js";
import { Person, personSelectionMold }                      from './pages/person/person.js';

import { carPageCss }                                       from "./pages/car/instantUpdateProjector.js";
import { carProjectDetailView, carProjectMasterView }       from "./pages/car/masterDetailProjector.js";
import { personPageCss }                                    from "./pages/person/instantUpdateProjector.js";
import { personProjectDetailView, personProjectMasterView } from "./pages/person/masterDetailProjector.js";

/********************************** SETUP ****************************************/

const carListController      = CarListController(Car);
const carSelectionController = CarSelectionController(carSelectionMold);

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);

const content = document.getElementById('content');
const style = document.getElementById('style');

/********************************** NAVIGATION ****************************************/

const navModel = NavigationModel('home');

const navController = NavigationController(navModel);

const navProjector = NavigationProjector(navController);

navProjector.projectNavigation();


/********************************** HOME ****************************************/

navController.addNavigationPoint('home', navEvent => {
    if (navEvent.getEventType() === EventType.PAGE_CHANGE && navEvent.getValue().toLowerCase() === 'home') {
        if (navController.getPageContent('home') === undefined) {
            content.innerHTML = '';

            const h1 = document.createElement('h1');
            /** @type { HTMLDivElement } */
            const div = document.createElement('div');
            const wrapper = document.createElement('div');
            const button = document.createElement('button');

            h1.innerText = navEvent.getValue().toUpperCase();
            wrapper.id = 'content-wrapper';
            button.innerText = "Create new navigation element";

            // styling all elements inline
            h1.style.setProperty('margin-top', '35px');
            div.style.setProperty('display', 'flex');
            div.style.setProperty('justify-content', 'center');
            button.style.setProperty('padding', '10px');
            button.style.setProperty('margin-top', '25px');
            // end styling

            wrapper.append(h1);
            div.append(button);
            wrapper.append(div);
            content.appendChild(wrapper);

            navController.setPageContent('home', wrapper);
            button.onclick = () => navController.addNavigationPoint("demo", navEvent => {
                if (navEvent.getEventType() === EventType.PAGE_CHANGE && navEvent.getValue().toLowerCase() === "demo") {
                    if(navController.getPageContent('demo') === undefined) {
                        content.innerHTML = '';

                        const wrapper = document.createElement('div');
                        const h1 = document.createElement('h1');
                        const div = document.createElement('div');
                        const p = document.createElement('p');
                        const trigger = document.createElement('button');

                        wrapper.id = 'content-wrapper';
                        h1.innerText = navEvent.getValue().toUpperCase();
                        let counter = 0;
                        p.innerText = 'demo: ' + counter;
                        trigger.innerText = "Count";
                        trigger.onclick = () => p.innerText = 'demo: ' + ++counter;

                        // styling all elements inline
                        h1.style.setProperty('margin-top', '35px');
                        div.style.setProperty('display', 'flex');
                        div.style.setProperty('justify-content', 'center');
                        div.style.setProperty('align-items', 'center');
                        div.style.setProperty('margin-top', '25px');
                        p.style.setProperty('padding-right', '15px');
                        trigger.style.setProperty('padding', '10px');
                        // end styling

                        wrapper.append(h1);
                        div.appendChild(p);
                        div.appendChild(trigger);
                        wrapper.append(div);
                        content.appendChild(wrapper);

                        navController.setPageContent('demo', wrapper);
                    }
                }
            });
        }
    }
});

/********************************** CAR ****************************************/

navController.addNavigationPoint('car', navEvent => {
    if (navEvent.getEventType() === EventType.PAGE_CHANGE && navEvent.getValue().toLowerCase() === 'car') {
        if (navController.getPageContent('car') === undefined) {

            content.innerHTML = '';
            style.innerHTML = '<link rel="shortcut icon" type="image/png" href="./img/logo/logo-60x54.png"/>' +
                              '<link rel="stylesheet"                     href="./pages/car/instantUpdateProjector.css">';

            // create the sub-views, incl. binding
            const [wrapper, detail] = baseConstructForMDView(navEvent.getValue().toUpperCase());

            content.append(wrapper);

            const carMaster = carProjectMasterView(carListController, carSelectionController,);
            document.getElementById('masterContainer').append(...carMaster);

            const carDetailForm = carProjectDetailView(carSelectionController, detail);
            document.getElementById('detailContainer').append(...carDetailForm);

            document.querySelector('head style').textContent += carPageCss;
            // binding of the main view

            document.getElementById('plus').onclick = _ => carListController.addModel();

            navController.setPageContent('car', wrapper);
        }
    }
});

/********************************** PERSON ****************************************/

navController.addNavigationPoint('person', navEvent => {
    if (navEvent.getEventType() === EventType.PAGE_CHANGE && navEvent.getValue().toLowerCase() === 'person') {
        if (navController.getPageContent('person') === undefined) {

            content.innerHTML = '';
            style.innerHTML = '<link rel="shortcut icon" type="image/png" href="./img/logo/logo-60x54.png"/>' +
                              '<link rel="stylesheet"                     href="./pages/person/instantUpdateProjector.css">';
            // create the sub-views, incl. binding
            const [wrapper, detail] = baseConstructForMDView(navEvent.getValue().toUpperCase());

            content.append(wrapper);

            const personMaster = personProjectMasterView(personListController, personSelectionController,);
            document.getElementById('masterContainer').append(...personMaster);

            const personDetailForm = personProjectDetailView(personSelectionController, detail);
            document.getElementById('detailContainer').append(...personDetailForm);

            document.querySelector('head style').textContent += personPageCss;
            // binding of the main view

            document.getElementById('plus').onclick = _ => personListController.addModel();

            navController.setPageContent('person', wrapper);
        }
    }
});

const baseConstructForMDView = pageName => {
    const wrapper = document.createElement('div');
    wrapper.id = 'content-wrapper';
    const h1 = document.createElement('h1');
    h1.innerText = pageName.toUpperCase();
    h1.style.setProperty('margin-top', '35px');
    wrapper.append(h1);

    const master = document.createElement('div');
    master.classList.add('card');

    const masterHolder = document.createElement('div');
    masterHolder.classList.add('holder');
    masterHolder.id = 'masterContainer';
    master.appendChild(masterHolder);

    const button = document.createElement('button');
    button.id = 'plus';
    button.autofocus = true;
    button.innerText = '+';
    masterHolder.appendChild(button);
    wrapper.appendChild(master);

    const detail = document.createElement('div');
    detail.classList.add('card');
    detail.id = 'detailCard;';

    const detailHolder = document.createElement('div');
    detailHolder.classList.add('holder');
    detailHolder.id = 'detailContainer';
    detail.appendChild(detailHolder);
    wrapper.appendChild(detail);

    return [wrapper, detail];
};
