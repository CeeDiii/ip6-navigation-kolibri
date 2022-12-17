import { NavigationController }                            from "./navigation/navigationController.js";
// import { NavigationProjector }                             from "./navigation/basicNavigationProjector.js";
// import { NavigationProjector }                             from "./navigation/dashboard/dashboardNavigationProjector.js";
import { NavigationProjector }                             from "./navigation/dashboard-refined/dashboardRefinedNavigationProjector.js";
import { BubbleStateNavigationProjector }                  from "./navigation/bubble-state/bubblestateNavigationProjector.js";
import { TreeNavigationProjector }                         from "./navigation/basic-tree/basicTreeNavigationProjector.js";
import { BreadCrumbProjector }                             from "./navigation/bread-crumbs/breadCrumbProjector.js";
import { PageController }                                  from "./pages/pageController.js";
import { ForbiddenPageProjector }                          from "./pages/403/forbiddenPageProjector.js";
import { PageNotFoundProjector }                           from "./pages/404/pageNotFoundProjector.js";
import { HomePageProjector }                               from "./pages/home/homePageProjector.js";
import { MasterDetailViewsPageProjector }                  from "./pages/masterDetailViews/masterDetailViewsPageProjector.js";
import { FormsPageProjector }                              from "./pages/forms/formsPageProjector.js";
import { WelcomePageProjector }                            from "./pages/welcome/welcomePageProjector.js";
import { Person, personSelectionMold }                     from "./pages/person/person.js";
import { PersonListController, PersonSelectionController } from "./pages/person/personController.js";
import { CarListController, CarSelectionController }       from "./pages/car/carController.js";
import { PersonPageProjector }                             from "./pages/person/personPageProjector.js";
import { Car,carSelectionMold }                            from "./pages/car/car.js";
import { CarPageProjector }                                from "./pages/car/carPageProjector.js";
import { WeekController }                                  from "./pages/workweek/workweek/weekController.js";
import { SimpleWorkWeekPageProjector }                     from "./pages/workweek/simpleWorkWeekPageProjector.js";
import { CHECKBOX, COLOR, DATE, NUMBER, TEXT, TIME }       from "./kolibri/util/dom.js";
import { SimpleFormController }                            from "./kolibri/projector/simpleForm/simpleFormController.js";
import { SimpleFormPageProjector }                         from "./pages/simpleForm/simpleFormPageProjector.js";

const pinToContentElement = document.getElementById("content");

// Assembling 403 error page as example. Can be modified
const errorForbiddenController = PageController("forbidden", null);
errorForbiddenController.setVisible(false);
ForbiddenPageProjector(errorForbiddenController, pinToContentElement, './pages/403/forbidden.html');

// Assembling 404 error page as example. Can be modified
const errorNotFoundController = PageController("pagenotfound", null);
errorNotFoundController.setVisible(false);
PageNotFoundProjector(errorNotFoundController, pinToContentElement, './pages/404/pageNotFound.html');

const homePageController = PageController("home", null);
homePageController.setIcon('./navigation/icons/house.svg');
homePageController.setNavigational(false);
HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');

const masterDetailViewsPageController = PageController("masterdetailviews", null);
masterDetailViewsPageController.setIcon('./navigation/icons/masterdetail.svg');
masterDetailViewsPageController.setNavigational(false);
MasterDetailViewsPageProjector(masterDetailViewsPageController, pinToContentElement, './pages/masterDetailViews/masterDetailViews.html');

const formsPageController = PageController("forms", null);
formsPageController.setIcon('./navigation/icons/forms.svg');
formsPageController.setNavigational(false);
FormsPageProjector(formsPageController, pinToContentElement, './pages/forms/forms.html');

const welcomePageController = PageController("welcome", null);
welcomePageController.setIcon('./navigation/icons/cute-robot.svg');
WelcomePageProjector(welcomePageController, pinToContentElement, './pages/welcome/welcome.html');

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("person", [personListController, personSelectionController]);
personPageController.setIcon('./navigation/icons/person.svg');
PersonPageProjector(personPageController, pinToContentElement, './pages/person/person.html');

const carListController      = CarListController(Car);
const carSelectionController = CarSelectionController(carSelectionMold);
const carPageController = PageController("car", [carListController, carSelectionController]);
carPageController.setIcon('./navigation/icons/car.svg');
CarPageProjector(carPageController, pinToContentElement, './pages/car/car.html');

const simpleWorkWeekPageController = PageController("workweek", [WeekController()]);
simpleWorkWeekPageController.setIcon('./navigation/icons/calendar.svg');
SimpleWorkWeekPageProjector(simpleWorkWeekPageController, pinToContentElement, './pages/workweek/workweek.html');

const formStructure = [
    {value: "Text",       label: "Text",   name: "text",   type: TEXT     },
    {value: 0,            label: "Number", name: "number", type: NUMBER   },
    {value: "1968-04-19", label: "Date",   name: "date",   type: DATE     },
    {value: 12 * 60 + 15, label: "Time",   name: "time",   type: TIME     },
    {value: false,        label: "Check",  name: "check",  type: CHECKBOX },
    {value: "",           label: "Color",  name: "color",  type: COLOR    }
];
const simpleFormController = SimpleFormController(formStructure);
const simpleFormPageController = PageController("simpleForm", [simpleFormController]);
simpleFormPageController.setIcon('./navigation/icons/simpleform.svg');
SimpleFormPageProjector(simpleFormPageController, pinToContentElement, './pages/simpleForm/simpleForm.html');

const navigationController = NavigationController();
navigationController.setWebsiteName('Kolibri');
navigationController.setWebsiteLogo('./img/logo/logo-new-128.svg');

const pinToNavElement = document.getElementById('nav');
BubbleStateNavigationProjector(navigationController, pinToNavElement);
const pinToDashboardNavElement = document.getElementById('dashboard-nav');
NavigationProjector(navigationController, pinToDashboardNavElement);
// const pinToTreeNavElement = document.getElementById('tree-nav');
// TreeNavigationProjector(navigationController, pinToTreeNavElement);
const pinToBreadCrumbElement = document.getElementById('bread-crumbs');
BreadCrumbProjector(navigationController, pinToBreadCrumbElement);

navigationController.addErrorPageController('E403', errorForbiddenController);
navigationController.addErrorPageController('E404', errorNotFoundController);
navigationController.addPageController(homePageController);
navigationController.addPageController(masterDetailViewsPageController);
navigationController.addPageController(formsPageController);
navigationController.addPageController(welcomePageController);
navigationController.addPageController(personPageController);
navigationController.addPageController(carPageController);
navigationController.addPageController(simpleFormPageController);
navigationController.addPageController(simpleWorkWeekPageController);

// Has to happen after adding to the navigation controller
welcomePageController.setParent(homePageController);
personPageController.setParent(masterDetailViewsPageController);
carPageController.setParent(masterDetailViewsPageController);
simpleFormPageController.setParent(formsPageController);
simpleWorkWeekPageController.setParent(formsPageController);

navigationController.setHomePage(welcomePageController.getHash());
