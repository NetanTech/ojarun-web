import React from 'react'
import { Favourite } from '../../../../../public/svg/svg'
import Button from '@/components/ui/Button'

const Empty = () => {
    return (
        <div className="py-30 flex flex-col items-center w-full justify-center gap-3">
            <Favourite />
            <h6>No favourite yet</h6>
            <p className="body-medium text-300">Saved items and meals will appear here</p>
            <Button as="button" size="sm" variant="primary">
                Browse market
            </Button>
        </div>
    )
}

export default Empty