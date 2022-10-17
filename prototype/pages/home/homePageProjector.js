export { HomePageProjector }
/**
 * @typedef PageProjectorType
 * @property { () => void } projectPage
 */

/**
 * @constructor
 * @param { PageControllerType } pageController
 * @returns { PageProjectorType }
 */

const HomePageProjector = pageController => {
    const pageWrapper = document.getElementById('content');
    const contentWrapper = document.createElement("div");

    const initialize = () => {
        const h1 = document.createElement('h1');
        const div = document.createElement('div');
        const wrapper = document.createElement('div');
        const welcomeDiv = document.createElement('div');

        h1.innerText = 'home';
        wrapper.id = 'content-wrapper';
        welcomeDiv.innerText = "Welcome to Navigation with Kolibri 2.0!";

        // styling all elements inline
        h1.style.setProperty('margin-top', '35px');
        div.style.setProperty('display', 'flex');
        div.style.setProperty('justify-content', 'center');
        // end styling

        wrapper.append(h1);
        div.append(welcomeDiv);
        wrapper.append(div);
        contentWrapper.appendChild(wrapper);

        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }
    };

    const projectPage = () => {
        // initialize content on first call
        if (contentWrapper.firstChild === null) {
            initialize();
        }
        // bind content to document
        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }
    };

    pageController.onValueChanged(newValue => {
        // add class for specific page styling
        contentWrapper.classList.add(newValue);
    });

    pageController.onActiveChanged(active => {
        if (active) {
            projectPage();
        }
    });

    return {
        projectPage
    }
};

