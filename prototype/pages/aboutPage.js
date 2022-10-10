export { aboutPage }

const aboutPage = () => {

    const content = document.createElement('div');

    const h1 = document.createElement('h1');
    const div = document.createElement('div');
    const wrapper = document.createElement('div');
    const aboutLabel = document.createElement('label');
    const input = document.createElement('input');

    h1.innerText = 'about';
    wrapper.id = 'content-wrapper';
    aboutLabel.innerText = 'Please enter your name: ';
    aboutLabel.for = 'name';
    input.id = 'name';

    // styling all elements inline
    h1.style.setProperty('margin-top', '35px');
    div.style.setProperty('display', 'flex');
    div.style.setProperty('justify-content', 'center');
    // end styling

    wrapper.append(h1);
    div.append(aboutLabel);
    wrapper.append(div);
    aboutLabel.append(input);
    content.appendChild(wrapper);

    return content;
};