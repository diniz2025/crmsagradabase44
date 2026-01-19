import Home from './pages/Home';
import CRM from './pages/CRM';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "CRM": CRM,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};