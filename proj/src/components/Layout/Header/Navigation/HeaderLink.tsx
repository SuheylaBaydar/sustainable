"use client"
import { useState } from 'react';
import Link from 'next/link';
import { HeaderItem } from '../../../../types/menu';
import { usePathname } from 'next/navigation';

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  if (!item.href) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => setSubmenuOpen(false)}
    >
      <Link href={item.href} className={`py-3 text-base flex font-normal hover:text-LightApricot dark:hover:text-primary ${path === item.href ? 'text-LightApricot dark:text-LightApricot' : 'text-white dark:text-white'}`}>
        {item.label}
        {item.submenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && (
        <div className="absolute py-2 top-8 left-0 mt-0.5 w-60 bg-white dark:bg-darkmode shadow-lg rounded-lg">
          {item.submenu.map((subItem, index) => (
            <Link key={index} href={subItem.href} className={`block px-4 py-2 text-black dark:text-white hover:bg-AliceBlue dark:hover:bg-darklight ${path === subItem.href ? "bg-primary text-white" : ""}`}>
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
