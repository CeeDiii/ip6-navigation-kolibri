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
    controller.onLocationChanged((newLocation, oldLocation) => {
        if(oldLocation !== null) {
            oldLocation.passivate(pageContent);
        }
        if(newLocation !== null) {
            pageContent = newLocation.activate();
        }
        document.getElementById('content').innerHTML = '';
        document.getElementById('content').appendChild(pageContent);
    });
};