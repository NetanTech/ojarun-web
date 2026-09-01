"use client";

import React from "react";
import { FullBox } from "../../../../../public/svg/CategoriesSvg/svg";
import { Cats } from "../../../../../constants/data";


const Categories = ({ selectedCat, setSelectedCat } : {
  selectedCat : string;
  setSelectedCat: (b: string) => void;
}) => {
  return (
    <div className="flex items-center md:flex-wrap md:gap-5 overflow-y-auto gap-5 md:max-w-300 w-full lg:mx-auto">
      <button className={`flex flex-col items-center shrink-0 gap-2 hover:bg-green-50 ${ selectedCat === 'all' ? 'bg-green-50' : 'bg-transparent' } p-2 rounded-xl`} onClick={() => setSelectedCat('all')}>
        <FullBox />
        <span className="text-sm font-medium">Browse all</span>
      </button>
      {Cats.map((category, i) => {
        const Icon = category.icon;
        return (
          <button key={i} className={`flex shrink-0 hover:bg-green-50  ${ category.name === selectedCat ? 'bg-green-50' : 'bg-transparent' } rounded-xl flex-col items-center justify-center md:w-25 md:h-25 p-2 gap-2`} onClick={() => setSelectedCat(category.name)}>
            <Icon  className="h-12 w-16 md:w-auto sm:h-16"/>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
