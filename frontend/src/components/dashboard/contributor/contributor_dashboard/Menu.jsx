import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <AddCircleOutlineIcon />,
        label: "Create Recipe",
        href: "/contributor/create-recipe",
        visible: ["contributor"],
      },
      {
        icon: <PendingIcon />,
        label: "Pending Recipes",
        href: "/contributor/pending-recipes",
        visible: ["contributor"],
      },
      {
        icon: <ChecklistIcon />,
        label: "Approved Recipes",
        href: "/contributor/approved-recipes",
        visible: ["contributor"],
      },
      {
        icon: <ThumbDownIcon />,
        label: "Rejected Recipes",
        href: "/contributor/rejected-recipes",
        visible: ["contributor"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        // visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        // visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        // visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        // visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        // visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        // visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  }
];

const Menu = () => {
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
