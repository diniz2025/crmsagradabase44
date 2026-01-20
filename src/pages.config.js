import CRM from './pages/CRM';
import Home from './pages/Home';
import Politica from './pages/Politica';
import Blog from './pages/Blog';
import ArtigoBlog from './pages/ArtigoBlog';
import RedeCredenciada from './pages/RedeCredenciada';
import __Layout from './Layout.jsx';


export const PAGES = {
    "CRM": CRM,
    "Home": Home,
    "Politica": Politica,
    "Blog": Blog,
    "ArtigoBlog": ArtigoBlog,
    "RedeCredenciada": RedeCredenciada,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};