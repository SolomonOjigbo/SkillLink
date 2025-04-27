// components/Footer.tsx
function Footer() {
  return (
    <footer className="mt-auto bg-gray-800 p-4 text-white">
      <div className="container mx-auto text-center">
        <p>
          © {new Date().getFullYear()} SkillLink App. Developed by Solomon
          Ojigbo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
