import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PendingIcon from "@mui/icons-material/Pending";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <PendingIcon />,
        label: "Pending Recipes",
        href: "/admin/pending-recipes",
        visible: ["admin"],
      },
      {
        icon: <ChecklistIcon />,
        label: "Approved Recipes",
        href: "/admin/approved-recipes",
        visible: ["admin"],
      },
      {
        icon: <ThumbDownIcon />,
        label: "Rejected Recipes",
        href: "/admin/rejected-recipes",
        visible: ["admin"],
      },

    ],
  }
];

const Menu = () => {
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector(
    (state) => state?.users?.userAuth
  );

  // console.log(userInfo);

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible) {
              return (
                <Link
                  to={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  {typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                  ) : (
                    item.icon
                  )}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
