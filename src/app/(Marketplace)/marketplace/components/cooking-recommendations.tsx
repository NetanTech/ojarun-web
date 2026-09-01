"use client";

import React from "react";
import { mockMeals } from "../../../../../constants/data";
import MealProductCard from "../../Acomponents/MealProductCard";

const CookingRecommendations = () => {
  return (
    <section className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
      <h5>What are you cooking today</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {
          mockMeals.map((meal, i) =>(
            <MealProductCard key={i} { ...meal } />
          ))
        }
      </div>
    </section>
  );
};

export default CookingRecommendations;
