import { TestSuite }            from "../kolibri/util/test.js";
import { NavigationController } from "./navigationController.js";
import { NavigationModel }      from "./navigationModel.js";
import { PageProjector }        from "../pages/pageProjector.js";
import { PageModel }                 from "../pages/pageModel.js";
import { VALUE }                from "../kolibri/presentationModel.js";


const ncSuite = TestSuite("navigationController");

const getObsValue = obs => obs.getObs(VALUE).getValue();
const getActivePageName = controller => {
    const pageObs = getObsValue(controller.getLocation());
    return getObsValue(pageObs.getName());
};

ncSuite.add('getLocation-home' , assert => {
    const homePageProj = PageProjector(undefined);
    const homePagePage = PageModel('home', homePageProj);

    const model      = NavigationModel(homePagePage);
    const controller = NavigationController(model);

    assert.is(getActivePageName(controller), 'home');
});

ncSuite.add('setLocation-test', assert => {
    const homePageProj = PageProjector(undefined);
    const homePagePage = PageModel('home', homePageProj);
    const testPage     = PageModel('test', homePageProj);

    const model      = NavigationModel(homePagePage);
    const controller = NavigationController(model);

    controller.addNavigationPoint(testPage);
    controller.setLocation('test');
    assert.is(getActivePageName(controller), 'test');
});

ncSuite.run();