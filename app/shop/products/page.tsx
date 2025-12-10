"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Package, Globe, Box, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { shopStore } from "@/store";

interface Tab {
  id: "inventory" | "global" | "my_products";
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
}

const TABS: Tab[] = [
  {
    id: "inventory",
    label: "Inventory",
    icon: Box,
    description: "Manage stock & visibility",
  },
  {
    id: "global",
    label: "Global Catalog",
    icon: Globe,
    description: "Import verified products",
  },
  {
    id: "my_products",
    label: "My Products",
    icon: Package,
    description: "Your custom items",
  },
];

export default function ProductsPage() {
  const { products, globalProducts, fetchProducts } = shopStore();
  const [activeTab, setActiveTab] = useState<
    "inventory" | "global" | "my_products"
  >("inventory");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      if (products.products.length === 0) await fetchProducts();
    })();
  }, [fetchProducts, products.products.length]);

  const filteredProducts = products.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8 w-full max-w-[100vw] overflow-x-hidden px-1 md:px-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your store inventory
          </p>
        </div>
        <Link href="/shop/products/new" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm">
            <Plus size={20} /> Add New Product
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                isActive
                  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-lg"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div
                className={`p-3 rounded-xl mb-3 transition-colors ${
                  isActive
                    ? "bg-white/20 text-white dark:bg-gray-900/10 dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Icon size={24} />
              </div>
              <span
                className={`text-lg font-bold ${
                  isActive
                    ? "text-white dark:text-gray-900"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`text-xs mt-1 ${
                  isActive
                    ? "text-gray-300 dark:text-gray-500"
                    : "text-gray-500"
                }`}
              >
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>
      <div className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={`Search in ${activeTab.replace("_", " ")}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-base focus:ring-2 focus:ring-yellow-500 outline-none transition-all shadow-sm"
        />
      </div>
      {activeTab === "inventory" && products.products.length > 0 && (
        <table className="w-full text-left mt-8 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="border-b p-4">Product Image</th>
              <th className="border-b p-4">Product Name</th>
              <th className="border-b p-4">Product Category</th>
              <th className="border-b p-4"> Brand </th>
              <th className="border-b p-4">Reating</th>
              <th className="border-b p-4">Is Active</th>
              <th className="border-b p-4">Is Global Product</th>
              <th className="border-b p-4">Pricing</th>
            </tr>
          </thead>
          <tbody className="bg-white m-5 p-6 dark:bg-gray-800 rounded-2xl  md:p-4 border shadow-sm transition-all w-full border-gray-100 dark:border-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="border-b p-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                </td>
                <td className="border-b p-4">{product.name}</td>
                <td className="border-b p-4">{product.category}</td>
                <td className="border-b p-4">{product.brand}</td>
                <td className="border-b p-4">{product.rating || "N/A"}</td>
                <td className="border-b p-4">{product.isActive}</td>
                <td className="border-b p-4">
                  {product.isGlobalProduct ? "Yes" : "No"}
                </td>
                <td className="border-b p-4">
                  <table className="mb-2 w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2">Id</th>
                        <th className="border p-2">Price (₹)</th>
                        <th className="border p-2">Discount (%)</th>
                        <th className="border p-2">Weight</th>
                        <th className="border p-2">Unit</th>
                        <th className="border p-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.pricing.map((price, index) => (
                        <tr key={index}>
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{price.price}</td>
                          <td className="border p-2">{price.discount || 0}</td>
                          <td className="border p-2">{price.weight}</td>
                          <td className="border p-2">{price.unit}</td>
                          <td className="border p-2">{price.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {activeTab === "global" && globalProducts.products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {globalProducts.products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 border shadow-sm transition-all w-full border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-3 md:gap-4 ">
                  <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shrink-0 self-start">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2 leading-tight mr-6"
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-y-2">
                      <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                        ₹{product.pricing[0].price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-end justify-between gap-y-2">
                  <div className="flex items-center gap-2"></div>
                  {products.products.filter((p) => p.id === product.id) ? (
                    <button
                      disabled
                      className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-default"
                    >
                      <Check size={14} /> Added
                    </button>
                  ) : (
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 active:scale-95">
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {activeTab === "my_products" &&
        products.products.filter((p) => p.isGlobalProduct != true).length >
          0 && (
          <table className="w-full text-left mt-8 border-collapse">
            <thead className="">
              <tr>
                <th className="border-b p-4">Product Image</th>
                <th className="border-b p-4">Product Name</th>
                <th className="border-b p-4">Product Category</th>
                <th className="border-b p-4">Brand </th>
                <th className="border-b p-4">Reating</th>
                <th className="border-b p-4">Is Active</th>

                <th className="border-b p-4">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white m-5 p-6 dark:bg-gray-800 rounded-2xl  md:p-4 border shadow-sm transition-all w-full border-gray-100 dark:border-gray-700"
                >
                  <td className="border-b p-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                  </td>
                  <td className="border-b p-4">{product.name}</td>
                  <td className="border-b p-4">{product.category}</td>
                  <td className="border-b p-4">{product.brand}</td>
                  <td className="border-b p-4">{product.rating || "N/A"}</td>
                  <td className="border-b p-4">
                    {product.isActive ? "Yes" : "No"}
                  </td>

                  <td className="border-b p-4">
                    <table className="mb-2 w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2">Id</th>
                          <th className="border p-2">Price (₹)</th>
                          <th className="border p-2">Discount (%)</th>
                          <th className="border p-2">Weight</th>
                          <th className="border p-2">Unit</th>
                          <th className="border p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.pricing.map((price, index) => (
                          <tr key={index}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{price.price}</td>
                            <td className="border p-2">
                              {price.discount || 0}
                            </td>
                            <td className="border p-2">{price.weight}</td>
                            <td className="border p-2">{price.unit}</td>
                            <td className="border p-2">{price.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}
