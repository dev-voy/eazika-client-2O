interface CreateShopPayload {
  shopName: string;
  shopCategory: string;

  shopImages: string[];
  fssaiNumber: string;
  gstNumber?: string;
  documents: {
    aadharImage: string;
    electricityBillImage: string;
    businessCertificateImage: string;
    panImage: string;
  };
}
interface NewProductFormData {
  productCategoryId: number;
  name: string;
  brand: string;
  description: string;
  images: string[];
  pricing: {
    price: number;
    discount?: number;
    weight: number;
    stock: number;
    unit: "grams" | "kg" | "ml" | "litre" | "piece";
  }[];
}

export { CreateShopPayload, NewProductFormData };
