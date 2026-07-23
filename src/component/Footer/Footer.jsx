import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  const socials = [
    {
      icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sumaiyakawsar/", label: "linkedin"
    },
    { icon: <FaGithub />, href: "https://github.com/sumaiyakawsar", label: "github" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/devsume/", label: "instagram" },
  ];
  return (
    <footer className="container flex items-center gap-8 w-full text-xs justify-between mx-auto px-6 py-8">
      <div className="text-center ">
        <span>Challenge by </span>
        <a href="https://www.frontendmentor.io?ref=challenge" className="text-accent">Frontend Mentor</a>.
        <span> Coded by </span>
        <a href="https://github.com/sumaiyakawsar" className="text-accent">Sumaiya Kawsar</a>.
      </div>
      <div className="flex justify-center gap-6 text-sm">
        {socials.map(({ icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent" aria-label={label}>
            {icon}
          </a>
        ))}
      </div>
    </footer>
  )
}

