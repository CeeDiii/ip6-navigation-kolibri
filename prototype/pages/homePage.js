export { homePage }

// TODO Make it possible to create a page as HTML file

const homePage = () => {

    const content = document.createElement('div');

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
    content.appendChild(wrapper);

    return content;
};