import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function seedInitialData() {
  const catSnap = await getDocs(collection(db, 'categories'));
  if (!catSnap.empty) return;

  console.log("Seeding KRBS Jewelry catalog data...");

  // Categories
  const cats = [
    { name: 'Gold Collection', imageUrl: 'https://images.unsplash.com/photo-1611085507273-2121b676fba9?auto=format&fit=crop&q=80&w=800' },
    { name: 'Diamond Collection', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Platinum Collection', imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800' }
  ];

  for (const cat of cats) {
    const catRef = await addDoc(collection(db, 'categories'), cat);
    
    // Subcategories
    const subRef = await addDoc(collection(db, 'subcategories'), {
      categoryId: catRef.id,
      name: 'Rings & Bands',
      description: 'Elegant jewelry for every occasion'
    });

    // Products
    const products = [
      {
        name: `${cat.name} Masterpiece`,
        description: 'Exquisite jewelry piece with intricate craftsmanship.',
        price: 2500,
        imageUrl: cat.imageUrl,
        categoryId: catRef.id,
        subCategoryId: subRef.id,
        dealerName: 'KRBS Direct',
        subItem: 'Ring',
        weight: 12.5,
        options: ['22K', '18K'],
        createdAt: new Date().toISOString()
      },
      {
        name: `${cat.name} Special`,
        description: 'Traditional design with a modern touch.',
        price: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        categoryId: catRef.id,
        subCategoryId: subRef.id,
        dealerName: 'Authentic Exports',
        subItem: 'Necklace',
        weight: 24.8,
        options: ['22K'],
        createdAt: new Date().toISOString()
      }
    ];

    for (const prod of products) {
      await addDoc(collection(db, 'products'), prod);
    }
  }
}
