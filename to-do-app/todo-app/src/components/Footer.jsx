import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#21262d] p-4 border-t border-gray-300 text-center">
      <p className="text-sm text-white">
        &copy; {new Date().getFullYear()} Victer Phiathep |{" "}
        <a
          href="https://github.com/victerphiathep"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white hover:text-white-700"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
