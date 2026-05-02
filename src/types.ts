export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface SubSubCategory {
  id: string;
  subCategoryId: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  options: string[];
  createdAt: string;
  dealerName: string;
  subItem: string;
  weight: number;
}

export interface AppSettings {
  deletePin: string;
}
