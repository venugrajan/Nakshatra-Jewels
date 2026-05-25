import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  LayoutGrid, 
  List,
  User,
  LogOut,
  Info,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Category, SubCategory, SubSubCategory, Product } from './types';
import { cn } from './lib/utils';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CatalogGrid from './components/CatalogGrid';
import BulkUploadModal from './components/BulkUploadModal';
import ExportImportModal from './components/ExportImportModal';
import ProductDetailModal from './components/ProductDetailModal';
import PinModal from './components/PinModal';
import ImageEditorModal from './components/ImageEditorModal';
import AddCategoryModal from './components/AddCategoryModal';
import AddSubCategoryModal from './components/AddSubCategoryModal';
import AddSubSubCategoryModal from './components/AddSubSubCategoryModal';
import { seedInitialData } from './lib/seed';
import { SplashScreen } from './components/SplashScreen';
import HomePage from './components/HomePage';

export default function App() {
  const [view, setView] = useState<'home' | 'catalog'>('home');
  const [showSplash, setShowSplash] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDataEngineOpen, setIsDataEngineOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'login' | 'delete' | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState<string | null>(null);
  const [isAddSubSubCategoryOpen, setIsAddSubSubCategoryOpen] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ type: 'category' | 'subcategory' | 'subsubcategory' | 'product', id: string } | null>(null);
  
  // Jewelry Filters
  const [itemNameFilter, setItemNameFilter] = useState('');
  const [dealerFilter, setDealerFilter] = useState('');
  const [weightMin, setWeightMin] = useState('');
  const [weightMax, setWeightMax] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    seedInitialData();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch static lookups (run once)
  useEffect(() => {
    const qCats = query(collection(db, 'categories'), orderBy('name'));
    const unsubCats = onSnapshot(qCats, (snap) => {
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'categories', setQuotaExceeded));

    const qSubCats = query(collection(db, 'subcategories'), orderBy('name'));
    const unsubSubCats = onSnapshot(qSubCats, (snap) => {
      setSubCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubCategory)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'subcategories', setQuotaExceeded));

    const qSubSubCats = query(collection(db, 'subsubcategories'), orderBy('name'));
    const unsubSubSubCats = onSnapshot(qSubSubCats, (snap) => {
      setSubSubCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubSubCategory)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'subsubcategories', setQuotaExceeded));

    return () => {
      unsubCats();
      unsubSubCats();
      unsubSubSubCats();
    };
  }, []);

  // Fetch Products (depend on sortOrder)
  useEffect(() => {
    const orderDirection = sortOrder === 'newest' ? 'desc' : 'asc';
    const qProds = query(collection(db, 'products'), orderBy('createdAt', orderDirection));
    const unsubProds = onSnapshot(qProds, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'products', setQuotaExceeded));

    return () => {
      unsubProds();
    };
  }, [sortOrder]);

  const filteredProducts = products.filter(p => {
    const matchesCat = !selectedCategory || p.categoryId === selectedCategory;
    const matchesSubCat = !selectedSubCategory || p.subCategoryId === selectedSubCategory;
    const matchesSubSubCat = !selectedSubSubCategory || p.subSubCategoryId === selectedSubSubCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.dealerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDealer = !dealerFilter || p.dealerName?.toLowerCase().includes(dealerFilter.toLowerCase());
    const matchesItemName = !itemNameFilter || p.name?.toLowerCase().includes(itemNameFilter.toLowerCase());
    const matchesWeight = (!weightMin || (p.weight || 0) >= parseFloat(weightMin)) &&
                          (!weightMax || (p.weight || 0) <= parseFloat(weightMax));

    return matchesCat && matchesSubCat && matchesSubSubCat && matchesSearch && matchesDealer && matchesItemName && matchesWeight;
  });

  const handleDeleteRequest = (type: 'category' | 'subcategory' | 'subsubcategory' | 'product', id: string) => {
    setPendingDelete({ type, id });
    setPinAction('delete');
    setIsPinModalOpen(true);
  };

  const handleAdminLoginRequest = () => {
    setPinAction('login');
    setIsPinModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    setSearchQuery('');
    setItemNameFilter('');
    setDealerFilter('');
    setWeightMin('');
    setWeightMax('');
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    
    try {
      const collectionName = 
        type === 'category' ? 'categories' : 
        type === 'subcategory' ? 'subcategories' : 
        type === 'subsubcategory' ? 'subsubcategories' :
        'products';
        
      await deleteDoc(doc(db, collectionName, id));
      
      // Cleanup relations if category deleted
      if (type === 'category') {
        const subsToDelete = subCategories.filter(s => s.categoryId === id);
        for (const sub of subsToDelete) await deleteDoc(doc(db, 'subcategories', sub.id));
        const prodsToDelete = products.filter(p => p.categoryId === id);
        for (const prod of prodsToDelete) await deleteDoc(doc(db, 'products', prod.id));
        if (selectedCategory === id) setSelectedCategory(null);
      } else if (type === 'subcategory') {
        const subSubsToDelete = subSubCategories.filter(ss => ss.subCategoryId === id);
        for (const ss of subSubsToDelete) await deleteDoc(doc(db, 'subsubcategories', ss.id));
        const prodsToDelete = products.filter(p => p.subCategoryId === id);
        for (const prod of prodsToDelete) await deleteDoc(doc(db, 'products', prod.id));
        if (selectedSubCategory === id) setSelectedSubCategory(null);
      } else if (type === 'subsubcategory') {
        const prodsToDelete = products.filter(p => p.subSubCategoryId === id);
        for (const prod of prodsToDelete) await deleteDoc(doc(db, 'products', prod.id));
        if (selectedSubSubCategory === id) setSelectedSubSubCategory(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const dealers: string[] = Array.from(new Set(products.map(p => p.dealerName).filter(Boolean))) as string[];

  return (
    <div className="flex h-screen bg-high-bg text-high-ink font-sans selection:bg-high-accent selection:text-white">
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {/* Sidebar - Navigation & Filters */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        subCategories={subCategories}
        subSubCategories={subSubCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => {
          setView('catalog');
          if (id === null) {
            handleResetFilters();
          } else {
            setSelectedCategory(id);
            setSelectedSubCategory(null);
            setSelectedSubSubCategory(null);
          }
        }}
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={(id) => {
          setSelectedSubCategory(id);
          setSelectedSubSubCategory(null);
        }}
        selectedSubSubCategory={selectedSubSubCategory}
        onSelectSubSubCategory={setSelectedSubSubCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAdmin={isAdmin}
        onDelete={handleDeleteRequest}
        onAddCategory={() => setIsAddCategoryOpen(true)}
        onAddSubCategory={(catId) => setIsAddSubCategoryOpen(catId)}
        onAddSubSubCategory={(subId) => setIsAddSubSubCategoryOpen(subId)}
        onLogoClick={() => setView('home')}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          isAdmin={isAdmin}
          onLogin={handleAdminLoginRequest}
          onLogout={() => setIsAdmin(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => setIsUploadOpen(true)}
          onDataEngineClick={() => setIsDataEngineOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onResetFilters={handleResetFilters}
          onSortToggle={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
          onLogoClick={() => setView('home')}
          sortOrder={sortOrder}
        />

        {quotaExceeded && (
          <div className="bg-high-danger text-white px-6 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>Firebase Quota Exceeded — Data access temporarily restricted. Will reset tomorrow.</span>
            </div>
            <button onClick={() => setQuotaExceeded(false)} className="underline">Dismiss</button>
          </div>
        )}

        {view === 'home' ? (
          <main className="flex-1 overflow-y-auto">
            <HomePage 
              categories={categories}
              onExplore={(catId) => {
                if (catId) setSelectedCategory(catId);
                setView('catalog');
              }}
            />
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-high-ink mb-1">
                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Catalog Gallery'}
                  </h1>
                  <p className="text-[#5E6C84] text-xs font-medium">
                    {filteredProducts.length} assets curated in the cloud
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-wider transition-all",
                      isFilterOpen ? "bg-high-accent text-white border-high-accent" : "bg-white border-high-border text-high-ink hover:bg-slate-50"
                    )}
                  >
                    <Filter size={12} /> {isFilterOpen ? 'Hide' : 'Show'} Filters
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-white border border-high-border rounded p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-1.5">
                        <label className="data-label">Item Name</label>
                        <input 
                          placeholder="Search item..."
                          value={itemNameFilter}
                          onChange={(e) => setItemNameFilter(e.target.value)}
                          className="w-full bg-slate-50 border border-high-border rounded px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-high-accent"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="data-label">Dealer Name</label>
                        <input 
                          placeholder="Search dealer..."
                          value={dealerFilter}
                          onChange={(e) => setDealerFilter(e.target.value)}
                          list="dealer-list-filter"
                          className="w-full bg-slate-50 border border-high-border rounded px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-high-accent"
                        />
                        <datalist id="dealer-list-filter" >
                          {dealers.map((d, i) => <option key={i} value={d} />)}
                        </datalist>
                      </div>
                      <div className="space-y-1.5">
                        <label className="data-label" >Min Weight (g)</label>
                        <input 
                          type="number"
                          placeholder="Min..."
                          value={weightMin}
                          onChange={(e) => setWeightMin(e.target.value)}
                          className="w-full bg-slate-50 border border-high-border rounded px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-high-accent"
                        />
                      </div>
                      <div className="space-y-1.5" >
                        <label className="data-label" >Max Weight (g)</label>
                        <input 
                          type="number"
                          placeholder="Max..."
                          value={weightMax}
                          onChange={(e) => setWeightMax(e.target.value)}
                          className="w-full bg-slate-50 border border-high-border rounded px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-high-accent"
                        />
                      </div>
                      <div className="flex items-end" >
                        <button 
                          onClick={() => {
                            setItemNameFilter('');
                            setDealerFilter('');
                            setWeightMin('');
                            setWeightMax('');
                            setSearchQuery('');
                          }}
                          className="w-full py-1 text-[10px] font-bold uppercase tracking-wider text-high-danger border border-high-danger/20 rounded hover:bg-high-danger-light transition-all"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CatalogGrid 
                products={filteredProducts}
                onProductClick={setViewingProduct}
                onEdit={setEditingProduct}
                onDelete={(id) => handleDeleteRequest('product', id)}
                isAdmin={isAdmin}
              />
            </div>
          </main>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div key="bulk-upload-modal">
            <BulkUploadModal 
              categories={categories}
              subCategories={subCategories}
              subSubCategories={subSubCategories}
              dealers={dealers}
              onClose={() => setIsUploadOpen(false)} 
            />
          </motion.div>
        )}
        {isDataEngineOpen && (
          <motion.div key="export-import-modal">
            <ExportImportModal 
              onClose={() => setIsDataEngineOpen(false)} 
            />
          </motion.div>
        )}
        {viewingProduct && (
          <motion.div key={`detail-${viewingProduct.id}`}>
            <ProductDetailModal 
              product={viewingProduct} 
              onClose={() => setViewingProduct(null)} 
              onNext={() => {
                const idx = filteredProducts.findIndex(p => p.id === viewingProduct.id);
                if (idx < filteredProducts.length - 1) {
                  setViewingProduct(filteredProducts[idx + 1]);
                } else {
                  setViewingProduct(filteredProducts[0]);
                }
              }}
              onPrev={() => {
                const idx = filteredProducts.findIndex(p => p.id === viewingProduct.id);
                if (idx > 0) {
                  setViewingProduct(filteredProducts[idx - 1]);
                } else {
                  setViewingProduct(filteredProducts[filteredProducts.length - 1]);
                }
              }}
            />
          </motion.div>
        )}
        {editingProduct && (
          <motion.div key={`editor-${editingProduct.id}`}>
            <ImageEditorModal 
              product={editingProduct} 
              onClose={() => setEditingProduct(null)} 
            />
          </motion.div>
        )}
        {isPinModalOpen && (
          <PinModal 
            key="pin-modal"
            onClose={() => {
              setIsPinModalOpen(false);
              setPendingDelete(null);
              setPinAction(null);
            }}
            onConfirm={() => {
              if (pinAction === 'login') {
                setIsAdmin(true);
              } else if (pinAction === 'delete') {
                handleConfirmDelete();
              }
              setIsPinModalOpen(false);
              setPendingDelete(null);
              setPinAction(null);
            }}
          />
        )}
        {isAddCategoryOpen && (
          <AddCategoryModal 
            key="add-category-modal"
            isOpen={isAddCategoryOpen}
            onClose={() => setIsAddCategoryOpen(false)}
          />
        )}
        {isAddSubCategoryOpen && (
          <AddSubCategoryModal 
            key={`add-sub-${isAddSubCategoryOpen}`}
            categoryId={isAddSubCategoryOpen}
            onClose={() => setIsAddSubCategoryOpen(null)}
          />
        )}
        {isAddSubSubCategoryOpen && (
          <AddSubSubCategoryModal 
            key={`add-subsub-${isAddSubSubCategoryOpen}`}
            subCategoryId={isAddSubSubCategoryOpen}
            onClose={() => setIsAddSubSubCategoryOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
