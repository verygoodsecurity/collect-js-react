import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Base from "./features/Basic"; 
import AdditionalData from "./features/AdditionalData";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Base />} />
          <Route path="/additional-data" element={<AdditionalData />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <>
      <nav className="menu">
        <Link to="/">Basic</Link>
        <Link to="/additional-data">Additional data</Link>
      </nav>
      <hr />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
