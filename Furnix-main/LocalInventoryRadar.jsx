import React, { useState, useEffect } from 'react';

/**
 * LocalInventoryRadar
 * Detects user location and checks nearby retail stores for physical product stock.
 */
const LocalInventoryRadar = ({ productId, variantId }) => {
    const [status, setStatus] = useState('idle'); // idle, locating, fetching, success, unavailable, error
    const [storeData, setStoreData] = useState(null);

    useEffect(() => {
        checkLocalInventory();
    }, [productId, variantId]);

    const checkLocalInventory = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            return;
        }

        setStatus('locating');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setStatus('fetching');

                try {
                    // Call the newly upgraded backend inventory API
                    const response = await fetch(`/api/inventory/nearby?lat=${latitude}&lng=${longitude}&productId=${productId}&variantId=${variantId}`);
                    
                    if (!response.ok) throw new Error('Inventory API error');
                    
                    const data = await response.json();

                    if (data.inStock && data.closestStore) {
                        setStoreData(data.closestStore);
                        setStatus('success');
                    } else {
                        setStatus('unavailable');
                    }
                } catch (error) {
                    console.error('Failed to fetch local inventory:', error);
                    setStatus('error');
                }
            },
            (error) => {
                console.warn('Geolocation permission denied or failed:', error);
                setStatus('error');
            }
        );
    };

    const handleReserve = () => {
        // Logic to trigger the in-store reservation flow
        window.location.href = `/reserve?storeId=${storeData.id}&productId=${productId}`;
    };

    if (status === 'locating' || status === 'fetching') {
        return <div className="text-muted small mt-2">Checking nearby store inventory...</div>;
    }

    if (status === 'success' && storeData) {
        return (
            <div className="local-inventory-radar mt-3 p-3 border rounded bg-light">
                <div className="d-flex align-items-center mb-2">
                    <span className="text-success me-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </span>
                    <strong className="text-success">
                        In Stock at {storeData.name} ({storeData.distance} miles away)
                    </strong>
                </div>
                <button 
                    onClick={handleReserve}
                    className="btn btn-outline-dark btn-sm w-100 fw-bold"
                >
                    Reserve & Pick Up Today
                </button>
            </div>
        );
    }

    // Fail silently or show a generic fallback for 'unavailable' or 'error' states
    return null;
};

export default LocalInventoryRadar;
