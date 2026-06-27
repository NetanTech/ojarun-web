"use client";

import { Check } from 'lucide-react';
import React from 'react'

interface RadioProps {
    onChange: () => void;
    isActive: boolean;
}

const Radio = ({ ...props }: RadioProps) => {
  return (
    <button className={`w-6 h-6 transition-all duration-150 rounded-full text-white ${ props.isActive ? 'bg-primary' : 'border' } flex items-center justify-center border-grey-200 `}
    onClick={props.onChange}>
        {
            props.isActive && (
                <Check size={15} />
            )
        }
    </button>
  )
}

export default Radio