import React from 'react';
import Link from 'next/link'; // o next faz a navegação através dos links

const NavLink = ({href, children}) => {
  return (
    <Link href={href}><a className='p-2 hover:underline hover:text-red-800'>{children}</a></Link>
  );
};

const NavBar = () => {
  return (
    <div className='bg-gray-500 py-4 text-center'>
      <NavLink href='/'> Inicio </NavLink>
      <NavLink href='/'> Sobre </NavLink>
      <NavLink href='/'> Cadastro </NavLink>
      <NavLink href='/'> Entrar </NavLink>
    </div>
  );
};

export default NavBar;