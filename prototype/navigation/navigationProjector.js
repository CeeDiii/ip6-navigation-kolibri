import { valueOf } from "../kolibri/presentationModel.js";

export { NavigationProjector }

/**
 * @constructor
 * @param   { !NavigationControllerType } controller - the navigation model this controller coordinates
 * @return  { NavigationProjectorType }
 * @example
 * TODO
 */
const NavigationProjector = controller => {
    let pageContent = document.createElement('div');
    pageContent.innerHTML = 'Yay';

    const link1 = document.createElement('a');
    link1.setAttribute('href','#home');
    link1.innerHTML = "home";
    const link2 = document.createElement('a');
    link2.setAttribute('href','#test');
    link2.innerHTML = "test";

    controller.onLocationChanged((newLocation, oldLocation) => {
        if(oldLocation !== null) {
            oldLocation.passivate(pageContent);
        }
        if(newLocation !== null) {
            pageContent = newLocation.activate();
        }
        document.getElementById('content').innerHTML = '';
        document.getElementById('content').append(link1, link2);
        document.getElementById('content').appendChild(pageContent);
    });

};