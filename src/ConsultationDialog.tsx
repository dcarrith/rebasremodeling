import { useState } from 'react';
import { supabase } from './lib/supabase';

interface ConsultationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultationDialog({ isOpen, onClose }: ConsultationDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        details: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('submitting');

        if (!supabase) {
            setErrorMessage("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.");
            setStatus('error');
            return;
        }

        const { error } = await supabase!
            .from('consultations')
            .insert([{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                details: formData.details
            }]);

        if (error) {
            console.error(error);
            setErrorMessage(error.message);
            setStatus('error');
        } else {
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '', details: '' });
            }, 3000);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden animate-in fade-in zoom-in duration-300 pointer-events-auto">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sage-400 hover:text-sage-900 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <h2 className="text-3xl font-light text-sage-900 mb-2">Book a <span className="font-extrabold italic">Consultation</span></h2>
                <p className="text-sage-600 font-light mb-8">Begin your journey to a serene and elevated living space.</p>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4">check_circle</span>
                        <h3 className="text-2xl font-bold text-sage-900 mb-2">Request Received</h3>
                        <p className="text-sage-600">Reba will contact you shortly to schedule your consultation.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-sage-900 mb-1">Full Name</label>
                            <input
                                id="name"
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sage-900 placeholder:text-sage-300"
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-sage-900 mb-1">Email</label>
                                <input
                                    id="email"
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sage-900 placeholder:text-sage-300"
                                    placeholder="jane@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-sage-900 mb-1">Phone <span className="font-normal text-sage-400">(Optional)</span></label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sage-900 placeholder:text-sage-300"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-bold text-sage-900 mb-1">Project Details</label>
                            <textarea
                                id="details"
                                required
                                rows={4}
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sage-900 placeholder:text-sage-300 resize-none"
                                placeholder="Tell us a little about the space you want to transform..."
                            />
                        </div>

                        {status === 'error' && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                                <p>Failed to submit request. Please ensure your Supabase credentials are configured correctly. ({errorMessage})</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-sage-900 text-white font-bold py-4 rounded-lg hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                    Processing...
                                </>
                            ) : 'Submit Request'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
