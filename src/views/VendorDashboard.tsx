import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { CustomSelect } from '../components/CustomSelect';
import { Product, Negotiation } from '../types';
import { Mic, MicOff, Download, MoreVertical, Plus, Package, Banknote, Tag, Bell, Search, Image as ImageIcon, Camera, TrendingUp, Edit2, Trash2, X, Menu, LayoutDashboard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dummyProducts, dummyNegotiations } from '../lib/dummyData';

// Polyfill for SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;


const CATEGORY_OPTIONS = [
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Meat & Poultry', label: 'Meat & Poultry' },
  { value: 'Dairy Products', label: 'Dairy Products' },
  { value: 'Grains & Cereals', label: 'Grains & Cereals' },
  { value: 'Spices & Herbs', label: 'Spices & Herbs' },
  { value: 'Fragrance', label: 'Fragrance' },
  { value: 'Textiles & Fabrics', label: 'Textiles & Fabrics' },
  { value: 'Household', label: 'Household' },
  { value: 'General', label: 'General' },
  { value: 'Other', label: 'Other' }
];

const UNIT_OPTIONS = [
  { value: 'pieces', label: 'pcs' },
  { value: 'cartons', label: 'cartons' },
  { value: 'boxes', label: 'boxes' },
  { value: 'bunches', label: 'bunches' },
  { value: 'kg', label: 'kg' },
  { value: 'liters', label: 'liters' },
  { value: 'bags', label: 'bags' },
  { value: 'baskets', label: 'baskets' }
];

export const VendorDashboard: React.FC = () => {
  const { user, profile, demoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [myNegotiations, setMyNegotiations] = useState<Negotiation[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchRecording, setIsSearchRecording] = useState(false);
  const [isPriceRecording, setIsPriceRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStockQuantity, setNewProductStockQuantity] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Vegetables');
  const [newProductUnit, setNewProductUnit] = useState('pieces');
  
  const [newProductImageUrl, setNewProductImageUrl] = useState('');

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductStockQuantity, setEditProductStockQuantity] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('Vegetables');
  const [editProductUnit, setEditProductUnit] = useState('pieces');
  const [editProductImageUrl, setEditProductImageUrl] = useState('');
  const [cameraMode, setCameraMode] = useState<'add' | 'edit'>('add');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (mode: 'add' | 'edit' = 'add') => {
    setCameraMode(mode);
    setIsCameraOpen(true);
  };


  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    const initCamera = async () => {
      if (!isCameraOpen) return;
      
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
          });
        } catch (e) {
          console.log("Environment camera failed, trying default camera");
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
        }
        activeStream = stream;
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions or try a different device.");
        setIsCameraOpen(false);
      }
    };
    
    initCamera();
    
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        if (cameraMode === 'add') {
          setNewProductImageUrl(dataUrl);
        } else {
          setEditProductImageUrl(dataUrl);
        }
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);


  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const searchRecognitionRef = useRef<any>(null);
  const priceRecognitionRef = useRef<any>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (demoMode && !user) {
      setProducts(dummyProducts.filter(p => p.vendor_id === 'v1'));
      setMyNegotiations(dummyNegotiations.filter(n => n.vendor_id === 'v1'));
      return;
    }

    if (!user) return;

    // Fetch Products
    const productsQ = query(collection(db, 'products'), where('vendor_id', '==', user.uid));
    const unsubProducts = onSnapshot(productsQ, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });

    // Fetch Negotiations
    const negQ = query(collection(db, 'negotiations'), where('vendor_id', '==', user.uid));
    const unsubNeg = onSnapshot(negQ, (snapshot) => {
      const negs: Negotiation[] = [];
      snapshot.forEach((doc) => negs.push({ id: doc.id, ...doc.data() } as Negotiation));
      setMyNegotiations(negs);
    });

    return () => {
      unsubProducts();
      unsubNeg();
    };
  }, [user, demoMode]);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-GH'; // Ghanaian English

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceInput(text);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      searchRecognitionRef.current = new SpeechRecognition();
      searchRecognitionRef.current.continuous = false;
      searchRecognitionRef.current.interimResults = false;
      searchRecognitionRef.current.lang = 'en-GH'; // Ghanaian English

      searchRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSearchQuery(text);
      };

      searchRecognitionRef.current.onend = () => {
        setIsSearchRecording(false);
      };

      priceRecognitionRef.current = new SpeechRecognition();
      priceRecognitionRef.current.continuous = false;
      priceRecognitionRef.current.interimResults = false;
      priceRecognitionRef.current.lang = 'en-GH';

      priceRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        // Extract numbers
        const numbers = text.match(/\d+(\.\d+)?/g);
        if (numbers) {
          setNewProductPrice(numbers[0]);
        }
      };

      priceRecognitionRef.current.onend = () => {
        setIsPriceRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  
  const togglePriceRecording = () => {
    if (isPriceRecording) {
      priceRecognitionRef.current?.stop();
      setIsPriceRecording(false);
    } else {
      priceRecognitionRef.current?.start();
      setIsPriceRecording(true);
    }
  };

  const toggleSearchRecording = () => {
    if (isSearchRecording) {
      searchRecognitionRef.current?.stop();
      setIsSearchRecording(false);
    } else {
      searchRecognitionRef.current?.start();
      setIsSearchRecording(true);
    }
  };

  const processVoiceInput = (text: string) => {
    // Simple heuristic-based NLP for demo purposes
    // e.g. "3 bunches of plantains for 50 cedis"
    const lowerText = text.toLowerCase();
    
    // Extract price
    const cediMatch = lowerText.match(/(\d+)\s*(cedis|ghs|cedi)/);
    if (cediMatch) {
      setNewProductPrice(cediMatch[1]);
    }

    // Extract product name (very basic heuristic: words before "for")
    const nameMatch = lowerText.split('for')[0].trim();
    if (nameMatch) {
      // Capitalize first letters
      setNewProductName(nameMatch.replace(/\b\w/g, l => l.toUpperCase()));
    }
    
    // Auto category mapping
    if (lowerText.includes('plantain') || lowerText.includes('yam') || lowerText.includes('cassava')) {
      setNewProductCategory('Product');
    } else if (lowerText.includes('fish') || lowerText.includes('meat')) {
      setNewProductCategory('Meat & Seafood');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile && !demoMode) return;

    let finalImageUrl = newProductImageUrl;
    
    if (demoMode && !user) {
      const newProduct = {
        id: 'demo_' + Date.now(),
        vendor_id: 'demo_user',
        name: newProductName,
        price_ghs: parseFloat(newProductPrice),
        stock_quantity: parseInt(newProductStockQuantity) || 0,
        category: newProductCategory,
        unit: newProductUnit,
        image_url: finalImageUrl,
        description: '',
        stock_status: true,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      setProducts([newProduct, ...products]);
    } else {
      try {
        const newProduct: any = {
          vendor_id: profile.id,
          name: newProductName,
          price_ghs: parseFloat(newProductPrice),
          stock_quantity: parseInt(newProductStockQuantity) || 0,
          category: newProductCategory,
          unit: newProductUnit,
          image_url: finalImageUrl,
          description: '',
          stock_status: true,
          created_at: Date.now(),
          updated_at: Date.now()
        };
        const docRef = await addDoc(collection(db, 'products'), newProduct);

      } catch (err) {
        console.error('Error adding product', err);
      }
    }
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStockQuantity('');
    setNewProductImageUrl('');
    setTranscript('');
  };


  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditProductName(product.name);
    setEditProductPrice(product.price_ghs.toString());
    setEditProductStockQuantity(product.stock_quantity?.toString() || '');
    setEditProductCategory(product.category);
    setEditProductUnit(product.unit || 'pieces');
    setEditProductImageUrl(product.image_url || '');
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    let finalImageUrl = editProductImageUrl;
    
    if (demoMode && !user) {
      setProducts(products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: editProductName,
            price_ghs: parseFloat(editProductPrice),
            stock_quantity: parseInt(editProductStockQuantity),
            category: editProductCategory,
            unit: editProductUnit,
            image_url: finalImageUrl,
            updated_at: Date.now()
          };
        }
        return p;
      }));
    } else {
      try {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          name: editProductName,
          price_ghs: parseFloat(editProductPrice),
          stock_quantity: parseInt(editProductStockQuantity),
          category: editProductCategory,
          unit: editProductUnit,
          image_url: finalImageUrl,
          updated_at: Date.now()
        });

      } catch (err) {
        console.error('Error updating product', err);
      }
    }
    closeEditModal();
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    if (demoMode && !user) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } else {
      try {
        await deleteDoc(doc(db, 'products', productToDelete.id));
      } catch (err) {
        console.error("Error deleting product", err);
      }
    }
    setProductToDelete(null);
  };

  const toggleStock = async (product: Product) => {
    if (demoMode && !user) {
      setProducts(products.map(p => p.id === product.id ? { ...p, stock_status: !p.stock_status } : p));
    } else {
      try {
        await updateDoc(doc(db, 'products', product.id), {
          stock_status: !product.stock_status,
          updated_at: Date.now()
        });

      } catch (err) {
        console.error('Error updating stock', err);
      }
    }
  };

  const actionableNegotiations = myNegotiations.filter(n => n.status === 'open' && n.last_actor !== 'vendor');

  const salesData = React.useMemo(() => {
    if (demoMode || myNegotiations.length === 0) {
      const data = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
          name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: demoMode ? Math.floor(Math.random() * 800) + 200 : 0
        });
      }
      return data;
    }
    
    const salesByDate: Record<string, number> = {};
    myNegotiations.filter(n => n.status === 'accepted').forEach(n => {
      const d = new Date(n.updated_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesByDate[key] = (salesByDate[key] || 0) + n.current_offer;
    });

    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data.push({
        name: key,
        sales: salesByDate[key] || 0
      });
    }
    return data;
  }, [demoMode, myNegotiations]);

  const weeklyAnalysis = React.useMemo(() => {
    if (salesData.length < 28) return null;
    
    // Group into 4 weeks (7 days each)
    // week 1 is oldest (days 0-6), week 4 is newest (days 21-27)
    // We have 30 days of data. Let's just take the last 28 days for 4 even weeks.
    const recent28 = salesData.slice(-28);
    
    const w1 = recent28.slice(0, 7).reduce((sum, d) => sum + d.sales, 0);
    const w2 = recent28.slice(7, 14).reduce((sum, d) => sum + d.sales, 0);
    const w3 = recent28.slice(14, 21).reduce((sum, d) => sum + d.sales, 0);
    const w4 = recent28.slice(21, 28).reduce((sum, d) => sum + d.sales, 0);

    let trendText = "Your sales have remained relatively stable this month.";
    if (w4 > w3 * 1.1) {
      trendText = "Excellent progress! Your sales this week are up significantly compared to last week.";
    } else if (w4 < w3 * 0.9) {
      trendText = "Notice: Sales have dipped a bit this week. Consider reviewing your inventory or offers.";
    } else if (w4 > 0 && w3 > 0) {
      trendText = "Steady performance! You're matching last week's sales pace.";
    } else if (w4 === 0 && w3 === 0 && w2 === 0 && w1 === 0) {
      trendText = "No sales recorded in the last 28 days. Add some products and start accepting offers!";
    }

    return { w1, w2, w3, w4, trendText };
  }, [salesData]);



  const exportInventoryToCSV = () => {
    if (products.length === 0) return;
    
    // Create CSV header
    const headers = ['Name', 'Category', 'Price (GHS)', 'Stock Quantity', 'Unit', 'In Stock'];
    
    // Create CSV rows
    const rows = products.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price_ghs,
      p.stock_quantity || 0,
      `"${p.unit || 'pcs'}"`,
      p.stock_status ? 'Yes' : 'No'
    ]);
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const exportSalesToCSV = () => {
    if (salesData.length === 0) return;
    
    const headers = ['Date', 'Sales (GHS)'];
    const rows = salesData.map(d => [`"${d.name}"`, d.sales]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_trend_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-32 relative min-h-[80vh]">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab === 'sales' ? 'Sales Trend' : activeTab}</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:text-slate-900">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`flex-col w-full md:w-64 shrink-0 gap-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-4 transition-all duration-300 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}>
        <button 
          onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </button>
        <button 
          onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'inventory' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Package className="w-5 h-5" />
          Inventory
        </button>
        <button 
          onClick={() => { setActiveTab('sales'); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'sales' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <TrendingUp className="w-5 h-5" />
          Sales Trend
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
      
            {activeTab === 'sales' && (<>
            {/* Sales Trend Chart */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex-shrink-0 overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sales Trends (Last 30 Days)</h2>
          </div>
          <button
            onClick={exportSalesToCSV}
            disabled={salesData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <div className="w-full h-64 sm:h-80 lg:h-96 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={10} 
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickFormatter={(val) => `₵${val}`} 
                dx={-10} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₵${Number(value).toFixed(2)}`, 'Sales']}
                labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {weeklyAnalysis && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex-shrink-0">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Weekly Analysis (Last 28 Days)</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 1</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w1.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 2</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w2.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 3</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w3.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">This Week</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w4.toFixed(2)}</div>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-800">{weeklyAnalysis.trendText}</p>
            </div>
          </div>
        )}
      </div>
      </>)}

      {activeTab === 'overview' && (<>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-shrink-0 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Banknote className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Total Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">
              ₵{salesData.reduce((acc, curr) => acc + curr.sales, 0).toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Products</p>
            <h3 className="text-2xl font-bold text-slate-900">{products.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Active Offers</p>
            <h3 className="text-2xl font-bold text-slate-900">{actionableNegotiations.length}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 md:pb-12 flex flex-col gap-8 overflow-visible mb-20 md:mb-0">
      {/* Voice Record Card */}
      <div className="flex flex-col lg:flex-row gap-8 items-center relative group">
        <div className="absolute inset-0 bg-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="flex-shrink-0 flex flex-col items-center gap-4 relative z-10">
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-2xl shadow-red-200 ring-8 ring-red-50' 
                : 'bg-[#10B981] text-white hover:bg-emerald-400 shadow-2xl shadow-emerald-200 ring-8 ring-emerald-50'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <span className="text-sm font-bold text-slate-500">
            {isRecording ? 'Listening...' : 'Tap to speak'}
          </span>
        </div>
        
        <div className="flex-1 w-full space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Quick Add Product</h2>
            {transcript && (
              <div className="w-full md:w-auto p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-left">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Recognized Text</span>
                </div>
                <p className="text-sm italic text-slate-700">"{transcript}"</p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-slate-400" />
                </div>
                <CustomSelect value={newProductCategory} onChange={setNewProductCategory} options={CATEGORY_OPTIONS} />
              </div>

              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newProductStockQuantity}
                    onChange={(e) => setNewProductStockQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    required
                  />
                </div>
                <CustomSelect value={newProductUnit} onChange={setNewProductUnit} options={UNIT_OPTIONS} className="w-32" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Banknote className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  placeholder="Price (GHS)"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={togglePriceRecording}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isPriceRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {isPriceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative flex gap-2 sm:col-span-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    title="Upload Image"
                  />
                  {newProductImageUrl && newProductImageUrl.startsWith('data:') && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none bg-slate-50 rounded-r-2xl pl-2">
                      <span className="text-xs text-emerald-600 font-bold">Image selected</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => startCamera('add')}
                  className="relative w-14 shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors"
                  title="Take Photo"
                >
                  <Camera className="h-5 w-5 text-slate-600" />
                </button>
              </div>
              
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-colors text-sm h-[50px]"
              >
                <Plus className="w-5 h-5" />
                <span>Add to Store</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Alerts */}
      {actionableNegotiations.length > 0 && (
        <div className="flex-shrink-0 bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">New Offers Available</h3>
            <p className="text-amber-700 mt-1 text-sm">You have {actionableNegotiations.length} active negotiation{actionableNegotiations.length > 1 ? 's' : ''} waiting for your response.</p>
          </div>
        </div>
      )}
      </div>
      </>)}

      {activeTab === 'inventory' && (<>
      {/* Inventory Management */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 overflow-visible">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
            <button
              onClick={exportInventoryToCSV}
              disabled={products.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-10 py-2 w-full sm:w-64 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-slate-50"
              />
              <button 
                onClick={toggleSearchRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  isSearchRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {isSearchRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            {categories.length > 0 && (
              <CustomSelect 
                value={selectedCategory || ''} 
                onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
                options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
                className="w-48"
              />
            )}
          </div>
        </div>
        <div className="pb-12 space-y-8">
          {products.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">Your inventory is empty. Use voice to add products!</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">No products match your search.</p>
            </div>
          ) : (
            (Object.entries(
              filteredProducts.reduce((acc, product) => {
                const cat = product.category || 'Other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(product);
                return acc;
              }, {} as Record<string, Product[]>)
            ) as [string, Product[]][]).sort(([a], [b]) => a.localeCompare(b)).map(([category, prods]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{prods.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prods.map((product) => {
                    const productNegs = myNegotiations.filter(n => n.product_id === product.id);
                    // Prioritize 'open' > 'accepted' > 'rejected' for the badge
                    const activeNeg = productNegs.find(n => n.status === 'open') 
                                  || productNegs.find(n => n.status === 'accepted') 
                                  || productNegs.find(n => n.status === 'rejected');
                    return (
                    <div key={product.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100/50 hover:shadow-md transition-all group relative">
                      <div className="absolute top-2 left-2 z-20">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditModal(product); }} 
                          className="bg-white/90 p-1.5 rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 z-20">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }} 
                          className="bg-white/90 p-1.5 rounded-full shadow-sm text-slate-600 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {activeNeg && (
                          <div className="absolute top-12 right-2 z-10">
                            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm ${
                              activeNeg.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                              activeNeg.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {activeNeg.status === 'open' ? 'In Progress' : activeNeg.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </span>
                          </div>
                      )}
                      <div className="h-32 bg-slate-200 rounded-2xl mb-3 overflow-hidden relative">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <Package className="w-12 h-12 text-slate-400" />
                          </div>
                        )}

                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate pr-2">{product.name}</h4>
                        {product.stock_status && product.stock_quantity !== undefined && product.stock_quantity <= 5 && (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded flex-shrink-0">
                            Low Stock ({product.stock_quantity} {product.unit || 'pcs'})
                          </span>
                        )}
                        {product.stock_status && (product.stock_quantity === undefined || product.stock_quantity > 5) && (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex-shrink-0">
                            Qty: {product.stock_quantity ?? 'N/A'} {product.unit || 'pcs'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-600 font-bold">₵{product.price_ghs.toFixed(2)}</span>
                        
                        <div className="flex items-center gap-1.5" onClick={() => toggleStock(product)}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer">
                            {product.stock_status ? 'Stock' : 'Out'}
                          </span>
                          <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${product.stock_status ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${product.stock_status ? 'right-0.5' : 'left-0.5'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </>)}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Product</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProduct} 
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-lg text-slate-900">Edit Product</h3>
              <button onClick={closeEditModal} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input
                    type="text"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Price (₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProductPrice}
                      onChange={(e) => setEditProductPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Quantity</label>
                    <input
                      type="number"
                      value={editProductStockQuantity}
                      onChange={(e) => setEditProductStockQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <CustomSelect value={editProductCategory} onChange={setEditProductCategory} options={CATEGORY_OPTIONS} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Unit</label>
                    <CustomSelect value={editProductUnit} onChange={setEditProductUnit} options={UNIT_OPTIONS} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Image</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        title="Upload Image"
                      />
                      {editProductImageUrl && editProductImageUrl.startsWith('data:') && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none bg-slate-50 rounded-r-2xl pl-2">
                          <span className="text-xs text-emerald-600 font-bold">Image selected</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => startCamera('edit')}
                      className="relative w-12 h-[50px] shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors"
                      title="Take Photo"
                    >
                      <Camera className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(e => console.error("Video play error:", e));
                }
              }}
              className="w-full h-full object-cover bg-slate-900"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="bg-black p-6 flex justify-between items-center pb-12 shrink-0">
            <button
              onClick={stopCamera}
              className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture
            </button>
            <div className="w-[100px] hidden sm:block" />
          </div>
        </div>
      )}
    </div>
  );
};
