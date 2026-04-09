import { Link, Outlet } from "react-router-dom";
import Menu from "./Menu";
import Navbar from "./Navbar";

const ContributorDashboard = ({ children }) => {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <div className="w-16 flex-shrink-0 h-16">
            <img
              src="/logo.png"
              alt="logo"
              className="w-full h-auto object-contain"
            />
          </div>
          {/* <span className="hidden lg:block font-bold">SchooLama</span> */}
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {/* {children} */}
        <Outlet />
      </div>
    </div>
  );
};

export default ContributorDashboard;
