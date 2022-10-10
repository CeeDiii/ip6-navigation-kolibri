export { aboutPage }

const aboutPage = () => {

    const content = document.createElement('div');

    const h1 = document.createElement('h1');
    const div = document.createElement('div');
    const wrapper = document.createElement('div');
    const aboutDiv = document.createElement('div');

    h1.innerText = 'about';
    wrapper.id = 'content-wrapper';
    aboutDiv.innerText = "This page is work in progress.";

    // styling all elements inline
    h1.style.setProperty('margin-top', '35px');
    div.style.setProperty('display', 'flex');
    div.style.setProperty('justify-content', 'center');
    // end styling

    wrapper.append(h1);
    div.append(aboutDiv);
    wrapper.append(div);
    content.appendChild(wrapper);

    return content;
};