import logoWithDesc from "@/common/assets/logo-with-desc.png";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section className="bg-slate-300">
      <footer className="mx-auto px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <Link to="/" reloadDocument>
          <img src={logoWithDesc} alt="logo Footer" className="mx-auto" />
        </Link>
        <p className="mt-4 text-center text-sm sm:mt-0">
          Copyright &copy; 2023. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default Footer;
