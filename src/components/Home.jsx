import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Programs from './Programs';
import Tutors from './Tutors';
import Features from './Features';
import Footer from './Footer';

// Importing the generated hero image
const HERO_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200";

const StatsSection = () => (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        <div className="container relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                    { label: "Students Enrolled", value: "25k+" },
                    { label: "Expert Tutors", value: "500+" },
                    { label: "Success Rate", value: "98%" },
                    { label: "Countries Reached", value: "45+" }
                ].map((stat) => (
                    <div key={stat.label}>
                        <p className="text-4xl lg:text-5xl font-black mb-2">{stat.value}</p>
                        <p className="text-blue-100 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CTASection = () => (
    <section className="section-padding relative">
        <div className="container">
            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8">
                        Ready to Accelerate <br /> Your Learning Journey?
                    </h2>
                    <p className="text-blue-100/80 text-lg mb-12 max-w-2xl mx-auto">
                        Join thousands of students who are already achieving their academic dreams with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login" className="btn bg-white text-blue-900 hover:scale-105 px-10 py-4 text-lg">
                            Get Started for Free
                        </Link>
                        <button className="btn border border-blue-400 text-white hover:bg-blue-400/10 px-10 py-4 text-lg">
                            View All Programs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Home = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero heroImage={HERO_IMAGE} />
                <Programs />
                <Tutors />
                <Features />
                {/* Extra Polish: Stats and CTA */}
                <StatsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
