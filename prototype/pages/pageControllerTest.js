import {TestSuite} from '../kolibri/util/test.js';
import {PageController} from './pageController.js';

const navigationSuite = TestSuite('pageController');

navigationSuite.add('getPageContentControllers', assert => {
    const controller1 = {};
    const controller2 = {};
    const dummyControllers = [controller1, controller2];

    const homePageController = PageController('home', dummyControllers);

    assert.is(homePageController.getPageContentControllers(), dummyControllers);
    assert.is(homePageController.getPageContentControllers()[0], dummyControllers[0]);
    assert.is(homePageController.getPageContentControllers()[1], dummyControllers[1]);
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

navigationSuite.add('getIsVisible', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.getIsVisible());

    homePageController.setIsVisible(false);

    assert.isTrue(!homePageController.getIsVisible());
});

navigationSuite.add('getIsNavigational', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.getIsNavigational());

    homePageController.setIsNavigational(false);

    assert.isTrue(!homePageController.getIsNavigational());
});

navigationSuite.add('onIconChanged', assert => {
    const homePageController = PageController('home', null);
    let changedIcon;

    homePageController.onIconChanged(icon => changedIcon = icon);

    assert.is(changedIcon, './navigation/icons/placeholder.svg');

    homePageController.setIcon('./navigation/icons/house.svg');

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
    let isVisited;

    homePageController.onVisitedChanged(state => isVisited = state);

    assert.isTrue(!isVisited);

    homePageController.setVisited(true);

    assert.isTrue(isVisited);
});

navigationSuite.add('onValueChanged', assert => {
    const homePageController = PageController('home', null);
    let value;

    homePageController.onValueChanged(newValue => value = newValue);

    assert.is(homePageController.getValue(), 'home');

    homePageController.setValue('about');

    assert.is(homePageController.getValue(), 'about');
});

navigationSuite.add('onIsNavigationalChanged', assert => {
    const homePageController = PageController('home', null);
    let isNavigational;

    homePageController.onIsNavigationalChanged(state => isNavigational = state);

    assert.isTrue(isNavigational);

    homePageController.setIsNavigational(false);

    assert.isTrue(!isNavigational);
});

navigationSuite.add('onIsVisibleChanged', assert => {
    const homePageController = PageController('home', null);
    let isVisible;

    homePageController.onIsVisibleChanged(state => isVisible = state);

    assert.isTrue(isVisible);

    homePageController.setIsVisible(false);

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
