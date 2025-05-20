import ThemeToggle from "../ui";

const Navbar = () => {
  return (
    <div className="bg-transparent fixed w-screen border-b-2 border-black dark:border-white  ">
      <ThemeToggle />
    </div>
  );
};

export default Navbar;
