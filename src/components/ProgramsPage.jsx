import React, { useEffect } from 'react';
import Navbar from './Navbar';
import DetailedPrograms from './DetailedPrograms';
import Footer from './Footer';

const ProgramsPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24">
                <DetailedPrograms />
            </div>
            <Footer />
        </div>
    );
};

export default ProgramsPage;
