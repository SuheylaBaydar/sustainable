"use client"
import { useState } from 'react';
import Link from 'next/link';
import { HeaderItem } from '../../../../types/menu';
import { usePathname } from 'next/navigation';

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  if (!item.href) return null;

  return (
    <div className="relative w-full">
      <Link
        href={item.href}
        onClick={item.submenu ? () => setSubmenuOpen(!submenuOpen) : undefined}
        className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-black dark:text-white focus:outline-hidden ${path === item.href ? 'bg-primary text-white! dark:bg-primary dark:text-white' : ''}`}
      >
        {item.label}
      </Link>
      {submenuOpen && item.submenu && (
        <div className="bg-white dark:bg-darkmode p-2 w-full">
          {item.submenu.map((subItem, index) => (
            <Link key={index} href={subItem.href} className={`block py-2 px-3 text-gray-500 hover:bg-gray-200 ${path === subItem.href ? 'text-primary!' : ''}`}>
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
