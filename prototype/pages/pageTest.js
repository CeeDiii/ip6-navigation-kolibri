import { TestSuite }            from "../kolibri/util/test.js";
import { PageModel }                 from "./pageModel.js";
import { PageProjector }        from "./pageProjector.js";

const ncSuite = TestSuite("page");

ncSuite.add('initialize-activate-test' , assert => {
    const projectPageFunc = () => {
        const content = document.createElement('div');
        content.innerText = 'Hello World';
        return content;
    };
    const pageProjector = PageProjector(projectPageFunc);
    const page = PageModel(pageProjector);
    page.initialize();
    const content = page.activate();
    assert.is(content.innerText, 'Hello World');
});

ncSuite.add('uninitialized-activate-test' , assert => {
    const projectPageFunc = () => { /* do nothing */ };
        const pageProjector = PageProjector(projectPageFunc);
        const page = PageModel(pageProjector);
        const content = page.activate();
        assert.is(content.innerText, 'Empty page. Please initialize.');
});

ncSuite.add('already-initialized-test' , assert => {
    const projectPageFunc = () => {
        const content = document.createElement('div');
        content.innerText = 'Hello World';
        return content;
    };
    const pageProjector = PageProjector(projectPageFunc);
    const page = PageModel(pageProjector);
    page.initialize();
    try {
        page.initialize();
    } catch (e) {
        assert.is(e, 'PageModel has already been initialized.');
    }
});

ncSuite.add('passivate-test' , assert => {
    const projectPageFunc = () => {
        const content = document.createElement('div');
        content.innerText = 'Hello World';
        return content;
    };
    const pageProjector = PageProjector(projectPageFunc);
    const page = PageModel(pageProjector);
    page.initialize();
    const content = page.activate();
    content.innerText = 'Goodbye World';
    page.passivate(content);
    const changedContent = page.activate();
    assert.is(changedContent.innerText, 'Goodbye World');
});

ncSuite.run();

