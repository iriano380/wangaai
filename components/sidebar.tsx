import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>Minha IA</h2>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/sobre">Sobre</Link></li>
        <li><Link href="/projetos">Projetos</Link></li>
        <li><Link href="/contato">Contato</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
