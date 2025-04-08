import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const FeaturedSection = () => {
  return (
    <section className='py-6 px-4 bg-white'>
        <div className='conatiner mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            {/* Featured 1 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiShoppingBag className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>FREE INTERNATIONAL SHIPPING</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
On all order over Rs.100
                </p>
            </div>
            {/* Featured 2 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiArrowPathRoundedSquare className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>14 DAYS RETURN</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                Money back gurantee
                </p>
            </div>
            {/* Featured 3 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiOutlineCreditCard className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>SECURE CHECKOUT</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                100%  secured checkout process
                </p>
            </div>
            
            
        </div>

    </section>
  )
}

export default FeaturedSection
