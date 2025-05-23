import ThemeToggle from "../ui";

const Navbar = () => {
  return (
    <div className="bg-transparent h-14 flex items-center justify-start ml-4 fixed w-screen border-b-2 border-black dark:border-white  ">
      <ThemeToggle />
    </div>
  );
};

export default Navbar;
