import ImageAvatar from "@src/assets/image-avatar.jpg";
import Logo from "@src/assets/icon.png";
import MoonIcon from "@src/assets/icon-moon.svg";
import SunIcon from "@src/assets/icon-sun.svg";
import { useEffect, useState } from "react";
export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme"));
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localTheme = localStorage.getItem("theme");
    if ((localTheme && localTheme === "dark") || prefersDarkMode) {
      document.documentElement.classList.add("dark");
    } else if ((localTheme && localTheme === "light") || !prefersDarkMode) {
      document.documentElement.classList.remove("dark");
    }

    if (localTheme && ["dark", "light"].includes(localTheme)) {
      setTheme(localTheme);
      return;
    }

    setTheme(prefersDarkMode ? "dark" : "light");
  }, []);

  const onClickTheme = () => {
    setTheme((prev) => {
      const theme = prev === "dark" ? "light" : "dark";
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
      return theme;
    });
  };
  return (
    <div className="bg-custom-darker-blue flex justify-between lg:flex-col lg:justify-between lg:max-w-[103px] lg:rounded-tr-[1.2rem] lg:rounded-br-[1.2rem] lg:fixed lg:min-h-screen lg:z-0 z-50 items-center sticky top-0 ">
      <img src={Logo} className="size-20 lg:w-[103px] lg:h-[103px]" />
      <div className="flex gap-5 h-20 lg:h-auto lg:mb-5 lg:flex-col lg:items-center lg:w-full">
        <div className="flex items-center">
          <button onClick={onClickTheme}>
            <img src={theme === "dark" ? SunIcon : MoonIcon} className="size-7" />
          </button>
        </div>

        <div className="flex items-center border-opacity-45 border-l-2 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:w-full lg:justify-center lg:pt-6 lg:mr-0 pl-6 mr-6 border-[#494E6E]">
          <img className="rounded-full size-10" src={ImageAvatar} />
        </div>
      </div>
    </div>
  );
}
