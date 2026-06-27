import React from 'react'
import { PaymentSlip } from '../../../../../public/svg/svg';
import Button from '@/components/ui/Button';

const Empty = () => {
  return (
    <div className="py-30 flex flex-col items-center w-full justify-center gap-3">
      <PaymentSlip />
      <p className="body-medium text-300">
        Your orders show here, make your first order
      </p>
      <Button as="button" size="sm" variant="primary">
        Browse market
      </Button>
    </div>
  );
};


export default Empty