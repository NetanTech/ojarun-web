"use client";

import React, { useState } from 'react'
import { BottleItem, ChevronDown, Market, Tag } from '../../../../public/svg/svg';
import Categories from '../marketplace/components/categories';

const Filters = () => {
    const [ selectedCat, setSelectedCat ] = useState< CategoriesType['name'] >( 'all' )
  return (
    <div className='flex flex-col gap-2 lg:mx-auto md:max-w-300 w-full px-4 py-3'>
        <Categories selectedCat={ selectedCat } setSelectedCat={setSelectedCat}/>
        <div className='flex items-center gap-3 w-full md:gap-5 overflow-y-auto'>
            <button className='flex items-center gap-2 bg-grayScale-50 font-medium px-2 py-1 rounded-2xl text-black'>
                <Tag />
                Offers
            </button>
            <button className='flex items-center gap-2 bg-grayScale-50 font-medium px-2 py-1 rounded-2xl text-black'>
                <Market />
                Market
                <ChevronDown />
            </button>
            <button className='flex items-center text-nowrap gap-2 bg-grayScale-50 font-medium px-2 py-1 rounded-2xl text-black'>
                <BottleItem />
                Item type
                <ChevronDown />
            </button>
        </div>
    </div>
  )
}

export default Filters

