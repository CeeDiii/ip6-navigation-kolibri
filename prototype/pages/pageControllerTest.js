import {TestSuite} from '../kolibri/util/test.js';
import {PageController} from './pageController.js';

const navigationSuite = TestSuite('pageController');

navigationSuite.add('getDynamicContentControllers', assert => {
    const controller1 = {};
    const controller2 = {};
    const dummyControllers = [controller1, controller2];

    const homePageController = PageController('home', dummyControllers);

    assert.is(homePageController.getDynamicContentControllers(), dummyControllers);
    assert.is(homePageController.getDynamicContentControllers()[0], dummyControllers[0]);
    assert.is(homePageController.getDynamicContentControllers()[1], dummyControllers[1]);
});

navigationSuite.add('getHash', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getHash(), '#home');
});

navigationSuite.add('getValue', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getValue(), 'home');

    homePageController.setValue('HOME');

    assert.is(homePageController.getValue(), 'HOME');
});

navigationSuite.add('getParent', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getParent(), null);

    const parentHomePageController = PageController('parentHome', null);
    homePageController.setParent(parentHomePageController);

    assert.is(homePageController.getParent(), parentHomePageController);
});

navigationSuite.add('isVisible', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.isVisible());

    homePageController.setVisible(false);

    assert.isTrue(!homePageController.isVisible());
});

navigationSuite.add('isNavigational', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.isNavigational());

    homePageController.setNavigational(false);

    assert.isTrue(!homePageController.isNavigational());
});

navigationSuite.add('onIconPathChanged', assert => {
    const homePageController = PageController('home', null);
    let changedIcon;

    homePageController.onIconPathChanged(icon => changedIcon = icon);

    assert.is(changedIcon, './navigation/icons/placeholder.svg');

    homePageController.setIconPath('./navigation/icons/house.svg');

    assert.is(changedIcon, './navigation/icons/house.svg');
});

navigationSuite.add('onActiveChanged', assert => {
    const homePageController = PageController('home', null);
    let isActive;

    homePageController.onActiveChanged(state => isActive = state);

    homePageController.activate();

    assert.isTrue(isActive);

    homePageController.passivate();

    assert.isTrue(!isActive);
});

navigationSuite.add('onVisitedChanged', assert => {
    const homePageController = PageController('home', null);
    let visited;

    homePageController.onVisitedChanged(state => visited = state);

    assert.isTrue(!visited);

    homePageController.setVisited(true);

    assert.isTrue(visited);
});

navigationSuite.add('onValueChanged', assert => {
    const homePageController = PageController('home', null);
    let value;

    homePageController.onValueChanged(newValue => value = newValue);

    assert.is(homePageController.getValue(), value);

    homePageController.setValue('about');

    assert.is(homePageController.getValue(), value);
});

navigationSuite.add('onNavigationalChanged', assert => {
    const homePageController = PageController('home', null);
    let isNavigational;

    homePageController.onNavigationalChanged(state => isNavigational = state);

    assert.isTrue(isNavigational);

    homePageController.setNavigational(false);

    assert.isTrue(!isNavigational);
});

navigationSuite.add('onVisibleChanged', assert => {
    const homePageController = PageController('home', null);
    let isVisible;

    homePageController.onVisibleChanged(state => isVisible = state);

    assert.isTrue(isVisible);

    homePageController.setVisible(false);

    assert.isTrue(!isVisible);
});

navigationSuite.add('onParentChanged', assert => {
    const homePageController = PageController('home', null);
    let parent;

    homePageController.onParentChanged(newParent => parent = newParent);

    assert.is(homePageController.getParent(), null);

    const parentHomePageController = PageController('parentHome', null);
    homePageController.setParent(parentHomePageController);

    assert.is(homePageController.getParent(), parent);
});



navigationSuite.run();
