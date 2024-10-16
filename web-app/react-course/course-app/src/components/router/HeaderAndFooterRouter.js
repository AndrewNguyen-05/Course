import { Outlet } from "react-router-dom";
import { Header } from "../layouts/Header";
import { TopBar } from "../layouts/TopBar";
import { Footer } from "../layouts/Footer";

export const HeaderAndFooterRouter = () => {
    return(
        <div>
            <TopBar/>
            <Header/>

            <Outlet/>

            <Footer/>

        </div>
    );
}