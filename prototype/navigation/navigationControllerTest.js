import {TestSuite} from "../kolibri/util/test.js";
import {PageController} from "../pages/pageController.js";
import {NavigationController} from "./navigationController.js";


const navigationSuite = TestSuite("navigationController");



navigationSuite.add("addPageController", assert => {
    const homePageController = PageController("home", null);
    const navigationController = NavigationController();

    assert.isTrue(navigationController.addPageController(homePageController));

    assert.is(navigationController.getPageController('#home'), homePageController)

    assert.isTrue(!navigationController.addPageController(homePageController));

    assert.isTrue(!navigationController.addPageController(null));

    assert.isTrue(!navigationController.addPageController(undefined));
});

navigationSuite.add("deletePageController", assert => {
    const homePageController = PageController("home", null);
    const navigationController = NavigationController();

    navigationController.addPageController(homePageController);

    assert.is(navigationController.getPageController('#home'), homePageController)

    navigationController.deletePageController('#home');

    assert.is(navigationController.getPageController('#home'), undefined);
});

navigationSuite.add("setHomepage", assert => {
    const homePageController = PageController("home", null);
    const navigationController = NavigationController();

    navigationController.addPageController(homePageController);

    assert.is(navigationController.getHomePage(), '');

    navigationController.setHomePage('home');

    assert.is(navigationController.getHomePage(), 'home');
});

navigationSuite.add("onNavigationHashAdd", assert => {
    const homePageController = PageController("home", null);
    const navigationController = NavigationController();
    let newHash;

    navigationController.onNavigationHashAdd(hash => newHash = hash);

    navigationController.addPageController(homePageController);

    assert.is(newHash, '#home');
});

navigationSuite.run();
