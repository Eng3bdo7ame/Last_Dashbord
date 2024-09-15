import React from 'react'
import Clients from '../clientsPages/Clients'
const page = () => {
    return (
        <div>
            <Clients />
        </div>
    )
}

export default React.memo(page)