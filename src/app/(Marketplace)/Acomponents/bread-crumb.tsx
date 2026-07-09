"use client";

import { ChevronRight } from '../../../../public/svg/svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface PropItem {
    icon?: React.ReactNode;
    title : string;
    href?: string;
}

interface Props {
    item : PropItem[]
}
const BreadCrumb = ({ item } : Props) => {
    const pathName = usePathname();
  return (
    <div className='flex items-center text-black gap-2'>
        {
            item.map((n, i) => (
                <div className='flex items-center gap-2' key={i}>
                    {
                        n.icon
                    }
                    <Link href={n?.href || ''} className={` ${n.href === pathName ? "text-primary" : 'text-grey-300 hover:text-grey-400'} font-medium `}>{ n.title }</Link>
                   {
                    i !== (item.length -1) && (
                         <ChevronRight size={15} className="text-grey-300"/>
                    ) 
                   } 
                </div>
            ))
        }
    </div>
  )
}

export default BreadCrumb