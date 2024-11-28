import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import AppHeaderDropdown from "./Header/AppHeaderDropdown";
import AdminSidebar from "./AdminSidebar";
import DocsCallout from "./DocsCallout";
import DocsLink from "./DocsLink";
import DocsExample from "./DocsExample";
import UserManage from "./User/UserManage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>,
  document.getElementById("root")
);
export {
  AdminFooter,
  AdminHeader,
  AppHeaderDropdown,
  AdminSidebar,
  DocsCallout,
  DocsLink,
  DocsExample,
  UserManage,
};
