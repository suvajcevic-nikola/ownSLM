import { TopSection } from "./components";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen flex flex-col gap-32 sm:gap-24 bg-black">
      <TopSection />
      {children}
    </div>
  );
};

export default Layout;
