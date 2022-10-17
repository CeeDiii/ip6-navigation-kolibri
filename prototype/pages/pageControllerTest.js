import {TestSuite} from "../kolibri/util/test.js";
import {PageController} from "./pageController.js";

const navigationSuite = TestSuite("pageController");

navigationSuite.add("onActiveChanged", assert => {
    const homePageController = PageController("home", null);
    let isActive;

    homePageController.onActiveChanged(state => isActive = state);

    homePageController.activate();

    assert.isTrue(isActive);

    homePageController.passivate();

    assert.isTrue(!isActive);
});

navigationSuite.add("getHash", assert => {
    const homePageController = PageController("home", null);

    assert.is(homePageController.getHash(), '#home');
});

navigationSuite.add("onIconChanged", assert => {
    const homePageController = PageController("home", null);
    let changedIcon;

    homePageController.onIconChanged(icon => changedIcon = icon);

    assert.is(changedIcon, 'placeholder');

    homePageController.setIcon('house');

    assert.is(changedIcon, 'house');
});

navigationSuite.run();
