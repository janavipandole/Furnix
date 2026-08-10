import React, { useState } from 'react';

/**
 * RequestSwatchModal
 * A 2-step micro-form allowing users to request physical fabric swatches.
 */
const RequestSwatchModal = ({ availableFabrics = [], productId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedSwatches, setSelectedSwatches] = useState([]);
    const [shippingDetails, setShippingDetails] = useState({ name: '', email: '', address: '', zip: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const toggleSwatch = (fabricId) => {
        setSelectedSwatches(prev => 
            prev.includes(fabricId) 
                ? prev.filter(id => id !== fabricId)
                : prev.length < 5 ? [...prev, fabricId] : prev
        );
    };

    const handleInputChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const submitSwatchRequest = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/swatches/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    swatches: selectedSwatches,
                    shipping: shippingDetails
                })
            });

            if (!response.ok) throw new Error('Failed to process request');
            
            setStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 3000);
        } catch (error) {
            console.error('Swatch request failed:', error);
            setStatus('error');
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedSwatches([]);
        setShippingDetails({ name: '', email: '', address: '', zip: '' });
        setStatus('idle');
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="btn btn-outline-dark btn-sm mt-2 w-100"
            >
                Order Free Fabric Swatches
            </button>
        );
    }

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
            <div className="modal-content bg-white p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h5 className="m-0">Request Free Swatches</h5>
                    <button onClick={() => setIsOpen(false)} className="btn-close" aria-label="Close"></button>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-4">
                        <h4 className="text-success">Success!</h4>
                        <p>Your swatches are being prepared and will be shipped shortly.</p>
                    </div>
                ) : step === 1 ? (
                    <div>
                        <p className="small text-muted mb-3">Select up to 5 fabrics to feel at home (Selected: {selectedSwatches.length}/5)</p>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {availableFabrics.map(fabric => (
                                <button
                                    key={fabric.id}
                                    onClick={() => toggleSwatch(fabric.id)}
                                    className={`btn btn-sm ${selectedSwatches.includes(fabric.id) ? 'btn-dark' : 'btn-outline-secondary'}`}
                                    disabled={!selectedSwatches.includes(fabric.id) && selectedSwatches.length >= 5}
                                >
                                    {fabric.name}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="btn btn-dark w-100" 
                            onClick={() => setStep(2)}
                            disabled={selectedSwatches.length === 0}
                        >
                            Continue to Shipping
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submitSwatchRequest}>
                        <p className="small text-muted mb-3">Where should we send your swatches?</p>
                        <input type="text" name="name" placeholder="Full Name" required className="form-control mb-2" value={shippingDetails.name} onChange={handleInputChange} />
                        <input type="email" name="email" placeholder="Email Address" required className="form-control mb-2" value={shippingDetails.email} onChange={handleInputChange} />
                        <input type="text" name="address" placeholder="Street Address" required className="form-control mb-2" value={shippingDetails.address} onChange={handleInputChange} />
                        <input type="text" name="zip" placeholder="Zip / Postal Code" required className="form-control mb-3" value={shippingDetails.zip} onChange={handleInputChange} />
                        
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setStep(1)}>Back</button>
                            <button type="submit" className="btn btn-dark w-50" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Processing...' : 'Submit Request'}
                            </button>
                        </div>
                        {status === 'error' && <p className="text-danger small mt-2">Something went wrong. Please try again.</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default RequestSwatchModal;
