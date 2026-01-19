import CRM from './pages/CRM';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "CRM": CRM,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};