import { Attribute, HASH, obsValueOf, VALUE } from "../kolibri/presentationModel.js";

export { NavigationProjector }

/**
 * @constructor
 * @return  { NavigationProjectorType }
 * @example
 * TODO
 */
const NavigationProjector = () => {
    // let pageContent = document.createElement('div');
    // pageContent.innerHTML = 'Yay';
    //
    // const link1 = document.createElement('a');
    // link1.setAttribute('href','#home');
    // link1.innerHTML = "home";
    // const link2 = document.createElement('a');
    // link2.setAttribute('href','#test');
    // link2.innerHTML = "test";
    //
    // controller.onLocationChanged((newLocation, oldLocation) => {
    //     if(oldLocation !== null) {
    //         oldLocation.passivate(pageContent);
    //     }
    //     if(newLocation !== null) {
    //         pageContent = newLocation.activate();
    //     }
    //     document.getElementById('content').innerHTML = '';
    //     document.getElementById('content').append(link1, link2);
    //     document.getElementById('content').appendChild(pageContent);
    // });

    const navigationAnchors = Attribute([]);

    const head = document.getElementsByTagName('head')[0];
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = './navigation/bubble_state_navigation/navigationProjector.css';
    head.appendChild(styles);

    const projectNavigation = navigationPoints => {
        const nav       = document.getElementById('nav');
        const div       = document.createElement('div');
        const ul        = document.createElement('ul');
        const indicator = document.createElement('div');

        div.classList.add('navigation');
        indicator.classList.add('indicator');

        nav.innerHTML = ''; // TODO remove
        const tempNavigationAnchors = [];
        for(const item of navigationPoints) { // TODO content, img, text as attributes
            const li   = document.createElement('li');
            const a    = document.createElement('a');
            const icon = document.createElement('span');
            const img  = document.createElement('img');
            const text = document.createElement('span');

            li.classList.add('list');

            const pageName = obsValueOf(item, HASH).substring(1); // cut out the #
            li.id = pageName;
            a.setAttribute('href', obsValueOf(item, HASH));
            icon.classList.add('icon');
            img.classList.add('icon');
            text.classList.add('text');
            text.innerText = pageName;

            icon.append(img);
            a.append(icon);
            a.append(text);
            li.append(a);
            ul.appendChild(li);

            // Collect anchor tags in temp array
            tempNavigationAnchors.push(a);
        }
        // Add observable navigation tag in a single change
        navigationAnchors.getObs(VALUE).setValue(tempNavigationAnchors);

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
            console.log(newLocation);
            const newLocationTag = document.getElementById(newLocation);
            const innerList = document.querySelectorAll('.list');
            innerList.forEach(item =>
                item.classList.remove('active')
            );
            newLocationTag.classList.add('active');
        }
    };

    return {
        projectNavigation,
        changeSelectedNavigationPoint,
    }

};