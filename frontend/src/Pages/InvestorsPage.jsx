import React from 'react'

const InvestorsPage = () => {
  return (
    // Added bright styling (bg-red-500, h-full, p-10) to confirm visibility
    <div className='bg-red-500 p-10 h-full w-full'>
        <h1 className="text-4xl text-white font-bold">
            ✅ MAIN CONTENT IS NOW VISIBLE!
        </h1>
        <p className="text-white mt-4">
            If you see this red box, the layout is fixed.
        </p>
    </div>
  )
}

export default InvestorsPage