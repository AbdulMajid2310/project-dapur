"use client";

import { motion } from "framer-motion";
import { FaShoppingCart, FaUtensils } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section id="beranda" className="relative pt-4 overflow-hidden">
      {/* Background Image */}
      <div className="">
        <div className="w-full h-140">

        <img
          src="/images/hero/hero2.png"
          alt="hero"
          className="w-full h-full object-cover rounded-2xl"
        />
        </div>
      </div>

      
    </section>
  );
}
