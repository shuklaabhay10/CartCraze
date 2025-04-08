import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/subscribe", { email });
      alert(res.data.message);
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    }
  };
  return (
<footer className="border-t py-8 px-10">
  <div className="flex flex-col md:flex-row items-start md:items-center gap-y-3 md:gap-x-20">
    {/* Newsletter Section */}
    <div className="w-full md:max-w-[40%]">
      <h3 className="text-lg text-gray-700 mb-2">Newsletter</h3>
      <p className="text-gray-500 text-sm mb-2">
        Be the first to hear about new products, exclusive events, and online offers.
      </p>
      <p className="font-medium text-sm text-gray-600 mb-4">
        Sign up and get 5% off your first order
      </p>
      {/* Newsletter Form */}
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
  <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="p-2 w-full sm:w-56 text-xs border focus:ring-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-all"
    required
  />
  <button
    type="submit"
    className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition-all w-full sm:w-auto"
  >
    Subscribe
  </button>
</form>

    </div>

    {/* Shop Links */}
    <div className="w-full md:w-auto">
      <h3 className="text-lg text-gray-800 mb-2">Shop</h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Men's Top Wear
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Women's Top Wear
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Men's Bottom Wear
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Women's Bottom Wear
          </Link>
        </li>
      </ul>
    </div>
        {/* support Links */}
    <div className="w-full md:w-auto">
      <h3 className="text-lg text-gray-800 mb-2">Support</h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Contact Us
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
          About Us
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            FAQs
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Feautures
          </Link>
        </li>
      </ul>
    </div>
     {/* policy Links */}
     <div className="w-full md:w-auto">
      <h3 className="text-lg text-gray-800 mb-2">Policy</h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
          Privacy policy
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Refund policy
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:text-gray-500 transition-colors">
            Shipping policy
          </Link>
        </li>
      </ul>
    </div>
  </div>
       {/* footer bottom */}
       <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">© 2025 Abhay Shukla. Inspired by passion, protected by law</p>

       </div>

</footer>

  );
};

export default Footer;
