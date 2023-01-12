import { Link } from "react-router-dom";

const DashHeader = () => {
  return (
    <header className="dash-header">
      <div className="dash-header__title">
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav"></nav>
      </div>
    </header>
  );
};
export default DashHeader;
