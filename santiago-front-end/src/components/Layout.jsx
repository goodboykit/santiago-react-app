import Navbar from "../components/Navbar";

function Layout({ children }) {
  return (
    <div>
      {/* Enhancement 3: Ensure navbar is always at the top */}
      <Navbar />
      {/* The rest of the page content goes here */}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
