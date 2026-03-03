import { useScroll } from '@react-three/drei';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import ConsultationDialog from './ConsultationDialog';

export default function Overlay() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // @ts-ignore
    const scroll = useScroll();

    const scrollToPage = (offset: number) => {
        if (scroll && scroll.el) {
            const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
            scroll.el.scrollTo({ top: maxScroll * offset, behavior: 'smooth' });
        }
    };
    return (
        <>
            <div className="relative flex w-full flex-col overflow-x-hidden">
                {/* Header / Navigation */}
                <header className="fixed top-0 z-50 w-full border-b border-sage-100 dark:border-sage-900/30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-16 lg:px-40 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">architecture</span>
                            </div>
                            <h1 className="text-sage-900 dark:text-slate-100 text-xl font-extrabold tracking-tight">REBA'S <span className="font-light text-sage-600">REMODELING</span></h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-10">
                            <button onClick={() => scrollToPage(4 / 20)} className="text-sage-900 dark:text-slate-100 text-sm font-medium hover:text-primary transition-colors">About</button>
                            <button onClick={() => scrollToPage(9 / 20)} className="text-sage-900 dark:text-slate-100 text-sm font-medium hover:text-primary transition-colors">Portfolio</button>
                            <button onClick={() => scrollToPage(1)} className="text-sage-900 dark:text-slate-100 text-sm font-medium hover:text-primary transition-colors">Contact</button>
                        </nav>
                        <button onClick={() => {
                            scrollToPage(1);
                            setTimeout(() => setIsDialogOpen(true), 1250);
                        }} className="bg-primary text-sage-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                            Consultation
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative h-[100vh] w-full flex items-center justify-center pointer-events-none">
                    <div className="max-w-4xl space-y-6 text-center px-6">
                        <h2 className="text-sage-900 text-4xl md:text-7xl font-light tracking-tight leading-tight">
                            Visionary Spaces, <br /><span className="font-extrabold">Elevated Living.</span>
                        </h2>
                        <p className="text-sage-700 text-base md:text-xl font-light max-w-2xl mx-auto">
                            High-end minimalist home remodeling tailored for the modern aesthetic and a serene lifestyle.
                        </p>
                        <div className="pt-4 pointer-events-auto">
                            <button
                                onClick={() => scrollToPage(4 / 20)}
                                className="bg-primary text-sage-900 px-10 py-4 rounded-lg text-base font-bold hover:bg-white transition-colors">
                                Start Your Journey
                            </button>
                        </div>
                    </div>
                </section>

                {/* About Reba Section */}
                <section className="relative h-[500vh] w-full">
                    <div className="h-[300vh] w-full pointer-events-none" />
                    <div className="sticky top-0 h-screen w-full flex items-center px-6 md:px-20 pointer-events-none">
                        <div className="max-w-2xl bg-white/50 backdrop-blur-xl p-6 md:p-12 rounded-2xl shadow-2xl pointer-events-auto border border-white/40">
                            <h3 className="text-3xl md:text-4xl font-light text-sage-900 tracking-tight mb-4 md:mb-6">Meet <span className="font-extrabold">Reba</span></h3>
                            <p className="text-slate-900 text-lg md:text-2xl leading-relaxed font-medium mb-4">
                                With over fifteen years of architectural mastery, Reba approaches every home as a blank canvas for peace. Her visionary design philosophy focuses on the interplay of light, shadow, and essential form.
                            </p>
                            <p className="text-slate-900 text-base md:text-xl leading-relaxed font-medium mb-4 md:mb-6">
                                We don't just remodel rooms; we curate experiences. Our mission is to eliminate the noise of modern life through precise, minimalist intervention.
                            </p>
                            <button
                                onClick={() => scrollToPage(9 / 20)}
                                className="text-sage-900 font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                                See Kitchens
                            </button>
                        </div>
                    </div>
                    <div className="h-[100vh] w-full pointer-events-none" />
                </section>

                {/* Services Grid (Split into pages for 3D exploration) */}

                {/* Kitchens */}
                <section className="relative h-[500vh] w-full">
                    <div className="h-[300vh] w-full pointer-events-none" />
                    <div className="sticky top-0 h-screen w-full flex items-center justify-end px-6 md:px-20 pointer-events-none">
                        <div className="max-w-xl bg-white/50 backdrop-blur-md p-6 md:p-12 rounded-2xl shadow-2xl pointer-events-auto border border-white/40">
                            <h3 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2 md:mb-4">Our Expertise</h3>
                            <h4 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-slate-900 tracking-tight">Kitchens</h4>
                            <p className="text-slate-900 font-medium leading-relaxed text-lg md:text-2xl mb-6 md:mb-8">Functional minimalism for the culinary heart of your home. Precision meets warmth in every detail, using the finest natural materials to craft a serene cooking environment.</p>
                            <button
                                onClick={() => scrollToPage(14 / 20)}
                                className="text-sage-900 font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                                See Bathrooms
                            </button>
                        </div>
                    </div>
                    <div className="h-[100vh] w-full pointer-events-none" />
                </section>

                {/* Bathrooms */}
                <section className="relative h-[500vh] w-full">
                    <div className="h-[300vh] w-full pointer-events-none" />
                    <div className="sticky top-0 h-screen w-full flex items-center justify-start px-6 md:px-20 pointer-events-none">
                        <div className="max-w-xl bg-white/50 backdrop-blur-md p-6 md:p-12 rounded-2xl shadow-2xl pointer-events-auto border border-white/40">
                            <h3 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2 md:mb-4">Our Expertise</h3>
                            <h4 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-slate-900 tracking-tight">Bathrooms</h4>
                            <p className="text-slate-900 font-medium leading-relaxed text-lg md:text-2xl mb-6 md:mb-8">Spa-like serenity utilizing raw textures, floating vanities, and modern fixtures for daily restoration and reflection.</p>
                            <button
                                onClick={() => scrollToPage(19 / 20)}
                                className="text-sage-900 font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                                See Living Spaces
                            </button>
                        </div>
                    </div>
                    <div className="h-[100vh] w-full pointer-events-none" />
                </section>

                {/* Living Spaces */}
                <section className="relative h-[400vh] w-full">
                    <div className="h-[300vh] w-full pointer-events-none" />
                    <div className="sticky top-0 h-screen w-full flex items-center justify-end px-6 md:px-20 pointer-events-none">
                        <div className="max-w-xl bg-white/50 backdrop-blur-md p-6 md:p-12 rounded-2xl shadow-2xl pointer-events-auto border border-white/40">
                            <h3 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2 md:mb-4">Our Expertise</h3>
                            <h4 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-slate-900 tracking-tight">Living Spaces</h4>
                            <p className="text-slate-900 font-medium leading-relaxed text-lg md:text-2xl mb-6 md:mb-8">Open, airy layouts designed for elevated living and architectural flow. Seamlessly connecting indoor tranquility with outdoor lighting.</p>
                            <button
                                onClick={() => {
                                    scrollToPage(1);
                                    setTimeout(() => setIsDialogOpen(true), 1250);
                                }}
                                className="text-sage-900 font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                                Book a Consultation
                            </button>
                        </div>
                    </div>
                </section>

                {/* Final CTA & Footer */}
                <section className="relative min-h-[100vh] w-full flex flex-col justify-end pointer-events-none mt-0">
                    <div className="bg-black/40 backdrop-blur-2xl pointer-events-auto w-full pt-16 md:pt-32 min-h-[100vh] flex flex-col justify-end">
                        <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-32 text-center">
                            <h2 className="text-white text-4xl md:text-7xl font-light leading-snug tracking-wide">
                                Ready to transform your <br />
                                <span className="font-extrabold italic">personal sanctuary?</span>
                            </h2>
                            <div className="mt-8 md:mt-14">
                                <button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="bg-white text-gray-900 px-8 py-4 md:px-16 md:py-6 rounded-lg text-xl md:text-2xl font-extrabold hover:scale-105 hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20">
                                    Book a Consultation
                                </button>
                            </div>
                        </div>

                        <footer className="border-t border-white/10 px-6 lg:px-40 py-8 md:py-16 text-left">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                                {/* Brand Column */}
                                <div className="col-span-1 md:col-span-1 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="text-primary">
                                            <span className="material-symbols-outlined text-2xl">architecture</span>
                                        </div>
                                        <h2 className="text-white text-lg font-extrabold tracking-tight">REBA'S <span className="font-light text-gray-300">REMODELING</span></h2>
                                    </div>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                                        Elevating residential architecture through minimalist design and precise craftsmanship since 2008.
                                    </p>
                                </div>

                                {/* Navigation Links */}
                                <div className="col-span-1 space-y-4">
                                    <h3 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Navigation</h3>
                                    <ul className="space-y-3">
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">About Reba</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Services</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Project Portfolio</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">Design Ethos</a></li>
                                    </ul>
                                </div>

                                {/* Contact Information */}
                                <div className="col-span-1 space-y-4">
                                    <h3 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Contact</h3>
                                    <ul className="space-y-3">
                                        <li className="text-gray-400 text-sm font-light flex items-start gap-2">
                                            <span className="material-symbols-outlined text-lg">location_on</span>
                                            <span>123 Architecture Blvd,<br />Suite 400<br />Design District, CA 90210</span>
                                        </li>
                                        <li><a href="mailto:hello@rebasremodels.com" className="text-gray-400 hover:text-white transition-colors text-sm font-light flex items-center gap-2"><span className="material-symbols-outlined text-lg">mail</span> hello@rebasremodels.com</a></li>
                                        <li><a href="tel:+13105550199" className="text-gray-400 hover:text-white transition-colors text-sm font-light flex items-center gap-2"><span className="material-symbols-outlined text-lg">phone</span> (310) 555-0199</a></li>
                                    </ul>
                                </div>

                                {/* Social Links */}
                                <div className="col-span-1 space-y-4">
                                    <h3 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Follow Us</h3>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                                            <span className="material-symbols-outlined">share</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Bar */}
                            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 tracking-wider">
                                <p>© {new Date().getFullYear()} REBA'S REMODELING. ALL RIGHTS RESERVED.</p>
                                <div className="flex gap-6">
                                    <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                                    <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </section>
            </div>
            {/* Consultation Dialog Modal */}
            {ReactDOM.createPortal(<ConsultationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />, document.body)}
        </>
    );
}
