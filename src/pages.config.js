import CRM from './pages/CRM';
import Home from './pages/Home';
import Politica from './pages/Politica';
import __Layout from './Layout.jsx';


export const PAGES = {
    "CRM": CRM,
    "Home": Home,
    "Politica": Politica,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};