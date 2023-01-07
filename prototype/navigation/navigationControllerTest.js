import {TestSuite} from '../kolibri/util/test.js';
import {PageController} from '../pages/pageController.js';
import {NavigationController} from './navigationController.js';

const navigationSuite = TestSuite('navigationController');

navigationSuite.add('addPageController', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    assert.isTrue(navigationController.addPageController(homePageController));

    assert.is(navigationController.getPageController('#home'), homePageController);

    assert.isTrue(!navigationController.addPageController(homePageController));

    assert.isTrue(!navigationController.addPageController(null));

    assert.isTrue(!navigationController.addPageController(undefined));
});

navigationSuite.add('deletePageController', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    navigationController.addPageController(homePageController);

    assert.is(navigationController.getPageController('#home'), homePageController);

    navigationController.deletePageController('#home');

    assert.is(navigationController.getPageController('#home'), undefined);
});

navigationSuite.add('setHomepage', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    navigationController.addPageController(homePageController);

    assert.is(navigationController.getHomePage(), '');

    navigationController.setHomePage(homePageController.getHash());

    assert.is(navigationController.getHomePage(), '#home');
});

navigationSuite.add('onNavigationHashAddAndDel', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();
    let newHash;
    let isDeleted = false;

    navigationController.onNavigationHashAdd(hash => newHash = hash);
    navigationController.onNavigationHashDel(() => isDeleted = true);

    navigationController.addPageController(homePageController);

    assert.is(newHash, '#home');

    navigationController.deletePageController(homePageController.getHash());

    assert.isTrue(isDeleted);
});

navigationSuite.add('onWebsiteNameChanged', assert => {
    const navigationController = NavigationController();
    let name;

    navigationController.onWebsiteNameChanged(newName => name = newName);

    navigationController.setWebsiteName('Kolibri');

    assert.is(name, 'Kolibri');
});

navigationSuite.add('onWebsiteLogoChanged', assert => {
    const navigationController = NavigationController();
    let logoPath;

    navigationController.onWebsiteLogoChanged(newPath => logoPath = newPath);

    navigationController.setWebsiteLogo('./logo/kolibri.png');

    assert.is(logoPath, './logo/kolibri.png');
});



navigationSuite.run();
