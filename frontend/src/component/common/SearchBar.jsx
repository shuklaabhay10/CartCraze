import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilter, setFilter } from "../../redux/slices/productsSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return; // Prevent empty searches
    }

    dispatch(setFilter({ search: searchTerm }));
    dispatch(fetchProductsByFilter({ search: searchTerm })).then(() => {
      navigate(`/collections/all?search=${searchTerm}`);
      setIsOpen(false);
    });
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form className="relative flex items-center w-full max-w-lg" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full placeholder:text-gray-600"
          />
          {/* Search Icon */}
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
            <HiMagnifyingGlass className="h-6 w-6" />
          </button>
          {/* Close Button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-500"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle} className="hover:text-gray-600">
          <HiMagnifyingGlass className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};


export default SearchBar;
