
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    )
}