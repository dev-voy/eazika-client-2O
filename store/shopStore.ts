import { create } from "zustand";
import { shopService } from "@/services/shopService";
import { ShopProductListType, GlobalProductListType } from "@/types/shop";

interface ShopState {
  products: ShopProductListType;
  globalProducts: GlobalProductListType;
  isLoading: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  featchGlobalProducts: () => Promise<void>;
  updateStock: (productId: number, newStock: number) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
}

export const shopStore = create<ShopState>((set) => ({
  products: {
    products: [],
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
  },
  globalProducts: {
    products: [],
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
  },
  isLoading: false,

  fetchProducts: async () => fetchProductsData(set),
  featchGlobalProducts: async () => fetchGlobalProductsData(set),
  updateStock: async (productId: number, newStock: number) =>
    updateStockData(productId, newStock, set),
  deleteProduct: async (productId: number) => deleteProductData(productId, set),
}));
// type Get = () => ShopState;
type Set = (
  state: Partial<ShopState> | ((state: ShopState) => Partial<ShopState>)
) => void;

// ============================ Actions ============================ //
const fetchProductsData = async (set: Set) => {
  set({ isLoading: true });
  try {
    const data = await shopService.getShopProducts();
    set({ products: data });
  } finally {
    set({ isLoading: false });
  }
};

const fetchGlobalProductsData = async (set: Set) => {
  set({ isLoading: true });
  try {
    const data = await shopService.getGlobalProducts();
    set({ globalProducts: data });
  } finally {
    set({ isLoading: false });
  }
};

const updateStockData = async (
  productId: number,
  newStock: number,
  set: Set
) => {
  // Optimistic Update
  set((state) => ({
    products: {
      ...state.products,
      products: state.products.products.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      ),
    },
  }));

  try {
    await shopService.updateStock(productId, newStock);
  } catch (error) {
    console.error("Stock update failed", error);
  }
};

const deleteProductData = async (productId: number, set: Set) => {
  set((state) => ({
    products: {
      ...state.products,
      products: state.products.products.filter((p) => p.id !== productId),
    },
  }));

  try {
    await shopService.deleteProduct(productId);
  } catch (error) {
    console.error("Delete failed", error);
  }
};

//   const { activeTab } = get();
//   set({ isLoading: true });
//   try {
//     let data: ShopProduct[] = [];
//     if (activeTab === "inventory") {
//       data = await ShopService.getInventory();
//     } else if (activeTab === "global") {
//       data = await ShopService.getGlobalCatalog();
//     } else if (activeTab === "my_products") {
//       // In a real app, this might be a separate endpoint.
//       // Here we filter inventory for custom items (assuming isGlobal=false means custom)
//       const inventory = await ShopService.getInventory();
//       data = inventory.filter((p) => !p.isGlobal);
//     }
//     set({ products: data });
//   } catch (error) {
//     console.warn("Failed to fetch products", error);
//   } finally {
//     set({ isLoading: false });
//   }
// },

// updateStock: async (id, newStock) => {
//   // Optimistic Update
//   set((state) => ({
//     products: state.products.map((p) =>
//       p.id === id ? { ...p, stock: newStock } : p
//     ),
//   }));

//   try {
//     await ShopService.updateStock(id, newStock);
//   } catch (error) {
//     console.error("Stock update failed", error);
//     // Revert logic could go here
//   }
// },

// toggleVisibility: async (id) => {
//   const product = get().products.find((p) => p.id === id);
//   if (!product) return;

//   const newStatus = !product.isActive;

//   // Optimistic Update
//   set((state) => ({
//     products: state.products.map((p) =>
//       p.id === id ? { ...p, isActive: newStatus } : p
//     ),
//   }));

//   try {
//     await ShopService.updateProductDetails(id, { isActive: newStatus });
//   } catch (error) {
//     console.error("Visibility toggle failed", error);
//   }
// },

// deleteProduct: async (id) => {
//   // Optimistic Remove
//   set((state) => ({
//     products: state.products.filter((p) => p.id !== id),
//   }));

//   try {
//     // Assuming ShopService has a delete method (we'll add it)
//     await ShopService.deleteProduct(id);
//   } catch (error) {
//     console.error("Delete failed", error);
//   }
// },

// addProductFromGlobal: async (product) => {
//   // Mock adding to inventory
//   console.log("Adding global product", product.name);
//   // In real app: await ShopService.addProduct({ ...product, isGlobal: true });
// },
