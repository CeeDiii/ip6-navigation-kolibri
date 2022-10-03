import { PageProjector } from "./pages/pageProjector.js";
import { Page } from "./pages/page.js";
import { homePage } from "./pages/homePage.js";


const homePageProj = PageProjector(homePage);

const page = Page('home', homePageProj);
page.initialize();
const pageContent = page.activate();
const content = document.getElementById('content');
content.appendChild(pageContent);

