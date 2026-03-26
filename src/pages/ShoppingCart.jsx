import React from 'react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();

  const upSells = [
    { id: 'u1', title: 'Magic Cookies', price: 4.99, image: '/images/products/cookie-set.jpg', category: 'BAKERY' },
    { id: 'u2', title: 'Pastel Pops', price: 2.50, image: '/images/products/pastel-pops.jpg', category: 'LOLLIPOPS' },
    { id: 'u3', title: 'Jelly Gems', price: 8.00, image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=400', category: 'GUMMIES' },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#fdfaff]">
        <div className="w-40 h-40 bg-white rounded-[40px] shadow-xl shadow-purple-100/50 flex items-center justify-center mb-10 animate-pulse">
          <span className="text-7xl">🍭</span>
        </div>
        <h1 className="text-5xl font-black text-[#2d2a4a] mb-6 tracking-tight">Your Stash is Empty</h1>
        <p className="text-xl text-[#8e8a9d] mb-12 max-w-md font-bold leading-relaxed">
          It looks like you haven't picked any treats yet. Let's find something sweet for you!
        </p>
        <Link to="/shop">
          <button className="bg-primary text-white text-xl font-black px-12 py-5 rounded-[22px] shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-105 transition-all">
            Explore Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfaff] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-[#2d2a4a] mb-3 tracking-tight">Your Sweet Stash</h1>
          <p className="text-lg text-[#8e8a9d] font-bold">You have {cartItems.length} delicious treats waiting for you.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:w-[65%] space-y-8">
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-[40px] p-8 flex flex-col sm:flex-row items-center gap-10 shadow-2xl shadow-purple-100/30 border border-[#ece8f1] group transition-all hover:border-primary/20">
                  {/* Image Container */}
                  <div className="w-36 h-36 bg-[#f8f7fa] rounded-[32px] overflow-hidden flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={item.image || '/images/products/placeholder.jpg'} 
                      alt={item.title} 
                      className="w-full h-full object-cover p-2"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Candy'}
                    />
                  </div>
                  
                  {/* Info Section */}
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                      <h3 className="text-2xl font-black text-[#2d2a4a] tracking-tight">{item.title}</h3>
                      <span className="inline-block px-4 py-1.5 bg-[#fdfaff] text-[#f13a7b] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#f13a7b]/10 w-fit mx-auto sm:mx-0">
                        {item.categoryTag || 'SOUR PACK'}
                      </span>
                    </div>
                    <p className="text-[#8e8a9d] font-bold text-sm mb-6">Sugar-coated artisanal delights</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-8">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#f8f7fa] rounded-full p-1.5 border border-[#ece8f1]">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-white text-[#2d2a4a] transition-all hover:scale-110 active:scale-95 border border-[#ece8f1]"
                        >
                          <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="w-10 text-center font-black text-lg text-[#2d2a4a]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-white text-[#2d2a4a] transition-all hover:scale-110 active:scale-95 border border-[#ece8f1]"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="flex items-center gap-2 text-[#b0a9bc] hover:text-error transition-colors font-black text-sm uppercase tracking-wider group/remove"
                      >
                        <Trash2 size={16} className="group-hover/remove:rotate-12 transition-transform" /> 
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right flex flex-col items-center sm:items-end min-w-[100px]">
                    <span className="text-3xl font-black text-[#f13a7b] tracking-tighter">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[#b0a9bc] font-bold text-xs mt-1 uppercase tracking-widest">Subtotal</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsells Section */}
            <div className="pt-16 pb-12">
              <h3 className="text-3xl font-black text-[#2d2a4a] mb-8 tracking-tight">Add a Little Extra?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upSells.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-full p-3 flex items-center gap-5 border-2 border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-purple-100/50 transition-all cursor-pointer group"
                    onClick={() => addToCart(product)}
                  >
                    <div className="w-14 h-14 bg-[#f8f7fa] rounded-full overflow-hidden flex-shrink-0 border border-[#ece8f1]">
                      <img 
                        src={product.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        alt={product.title}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                      />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-black text-[#2d2a4a] text-sm truncate uppercase tracking-tight">{product.title}</p>
                      <p className="text-[#f13a7b] font-black text-sm">${product.price.toFixed(2)}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:w-[35%] w-full sticky top-32">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-purple-100/50 border border-[#ece8f1] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 text-primary"></div>
              
              <h2 className="text-3xl font-black text-[#2d2a4a] mb-10 tracking-tight relative z-10">Order Summary</h2>
              
              <div className="space-y-6 mb-10 text-[16px] relative z-10">
                <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                  <span>Subtotal</span>
                  <span className="text-[#2d2a4a]">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                  <span>Shipping</span>
                  <span className="text-[#00c896] uppercase tracking-widest text-xs font-black">Free</span>
                </div>
                <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                  <span>Sweet Tax</span>
                  <span className="text-[#2d2a4a]">${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t-2 border-[#f8f7fa] pt-10 mb-10 relative z-10">
                <div className="flex justify-between items-end mb-10">
                  <span className="text-xl font-black text-[#2d2a4a] uppercase tracking-widest">Total</span>
                  <span className="text-5xl font-black text-[#f13a7b] tracking-tighter leading-none">
                    ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>

                {/* Promo Code */}
                <div className="relative mb-10 group">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="w-full bg-[#f8f7fa] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[22px] py-4.5 px-6 font-black text-[#2d2a4a] placeholder-[#b0a9bc] outline-none transition-all shadow-inner"
                  />
                  <button className="absolute right-2 top-1.5 bottom-1.5 bg-[#2d2a4a] text-white px-6 rounded-[18px] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block w-full">
                  <button className="w-full bg-gradient-to-r from-primary to-[#f13a7b] text-white py-6 rounded-[22px] font-black text-xl shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group">
                    Proceed to Checkout
                    <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <p className="text-[11px] text-center text-[#b0a9bc] mt-8 font-bold leading-relaxed">
                  By clicking checkout, you agree to our Sweet Terms and delicious policies.
                </p>
              </div>

              {/* Secure Checkout Trust Signals */}
              <div className="flex flex-col items-center pt-2 relative z-10">
                <span className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-6">Secure Checkout</span>
                <div className="flex items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
