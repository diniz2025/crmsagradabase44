import ArtigoBlog from './pages/ArtigoBlog';
import Blog from './pages/Blog';
import CRM from './pages/CRM';
import Home from './pages/Home';
import Politica from './pages/Politica';
import RedeCredenciada from './pages/RedeCredenciada';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ArtigoBlog": ArtigoBlog,
    "Blog": Blog,
    "CRM": CRM,
    "Home": Home,
    "Politica": Politica,
    "RedeCredenciada": RedeCredenciada,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};