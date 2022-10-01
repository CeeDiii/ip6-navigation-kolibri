export { homePage }

const homePage = () => {

    const content = document.createElement('div');

    const h1 = document.createElement('h1');
    const div = document.createElement('div');
    const wrapper = document.createElement('div');
    const button = document.createElement('button');

    h1.innerText = 'home';
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

    return content;
};