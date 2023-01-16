import { Link } from "react-router-dom";

const Public = () => {
  return (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">COMPANY</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
          perspiciatis inventore, adipisci exercitationem blanditiis optio nobis
          possimus magnam perferendis error.
        </p>
        <address className="public__addr">
          MAIN NAME
          <br />
          ADDRESS#1
          <br />
          ADDRESS#2
          <br />
          <a href="tel:+15555555555">PHONE NUMBER</a>
        </address>
        <br />
        <p>Owner: OWNER NAME</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
};
export default Public;
