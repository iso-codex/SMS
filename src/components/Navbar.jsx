import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Rocket, GraduationCap, BookOpen, LogIn, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Programs',
      href: '/programs',
      dropdown: [
        { name: 'Cambridge Checkpoint', icon: GraduationCap, sub: 'Primary & Lower Secondary' },
        { name: 'IGCSE Preparation', icon: BookOpen, sub: 'Year 10 & 11 Intensive' },
        { name: 'IELTS/SAT', icon: Rocket, sub: 'University Entrance Prep' },
      ]
    },
    { name: 'Tutors', href: '#tutors' },
    { name: 'Resources', href: '#' },
    { name: 'About', href: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:bg-blue-600 transition-colors">
            S
          </div>
          <span className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">SMS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={link.href}
                className="flex items-center gap-1.5 font-bold text-sm text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                {link.name}
                {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
              </Link>

              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-6"
                    >
                      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-3 w-[22rem] overflow-hidden">
                        <div className="p-4 border-b border-slate-50 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Our Curriculum</p>
                        </div>
                        {link.dropdown.map((item) => (
                          <a
                            key={item.name}
                            href="#"
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group/item"
                          >
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                              <item.icon size={20} />
                            </div>
                            <div>
                              <span className="block text-sm font-bold text-slate-900 mb-0.5">{item.name}</span>
                              <span className="block text-xs text-slate-500 font-medium">{item.sub}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-2 font-bold text-sm text-slate-900 px-6 py-2 hover:text-blue-600 transition-colors">
            <LogIn size={18} /> Login
          </Link>
          <Link to="/login" className="btn btn-primary bg-slate-900 border-none shadow-xl hover:bg-blue-600">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-40 bg-white"
          >
            <div className="container h-full py-8 flex flex-col gap-8 pt-24">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col gap-4">
                  <a href={link.href} className="text-4xl font-extrabold text-slate-900 tracking-tight">{link.name}</a>
                  {link.dropdown && (
                    <div className="pl-6 border-l-2 border-slate-100 flex flex-col gap-4">
                      {link.dropdown.map((item) => (
                        <a key={item.name} href="#" className="flex items-center gap-3 text-slate-500 font-bold">
                          <item.icon size={20} className="text-blue-600" /> {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-4 mt-auto">
                <Link to="/login" className="btn btn-outline w-full py-5 text-xl">Sign In</Link>
                <Link to="/login" className="btn btn-primary w-full py-5 text-xl uppercase tracking-widest bg-slate-900">Get Started</Link>
              </div>
            </div>
            <button
              className="absolute top-6 right-6 p-2 text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
