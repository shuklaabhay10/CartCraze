import React, { useEffect, useState,useRef  } from 'react'
import {FaFilter} from 'react-icons/fa'
import FilterSidebar from '../component/product/FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from '../component/product/ProductGrid'
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilter } from '../redux/slices/productsSlice';
const CollectionPages = () => {
    const {collection} = useParams()
    const [searchParams] = useSearchParams();    
    const dispatch = useDispatch()
    const {products,loading,error} = useSelector((state) => state.products)
    const queryParams = Object.fromEntries([...searchParams.entries()]);
    const sidebarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    useEffect(() => {
        dispatch(fetchProductsByFilter({collection, ...queryParams}))

    }, [dispatch,collection,searchParams])
    const toggleSidebar = () =>{
        setIsSidebarOpen(!isSidebarOpen)
    }
    //close sidebar if click outside
    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }
    }
    // event listner for clicks
    useEffect(() => {
      document.addEventListener("mousedown",handleClickOutside)  
      // clean event listener
      return () => {
        document.removeEventListener("mousedown",handleClickOutside)

      }
    })
   
  return (
   <div className='flex flex-col lg:flex-row'>
    {/* mobile filter button */}
    <button 
    onClick={toggleSidebar}
    className='lg:hidden border p-2 flex justify-center items-center'>
    < FaFilter className='mr-2'/>
    </button>
        {/* filter sidebar */}
        <div ref={sidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0':'-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
        >
         <FilterSidebar/>
        </div>
        <div className='flex-grow p-4'>
            <h2 className='text-2xl uppercase mb-4'>All Collection</h2>
                {/* sort options */}
                <SortOptions/>
                {/* product grid */}
                <ProductGrid products={products} loading={loading} error={error}/>


        </div>

   </div>
  )
}

export default CollectionPages
