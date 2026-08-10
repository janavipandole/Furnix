import React, { useState, useEffect } from 'react';

/**
 * StyleMatchCarousel
 * AI-driven recommendation engine component that cross-sells complementary 
 * furniture pieces based on aesthetic cohesion and style embeddings.
 */
const StyleMatchCarousel = ({ productId, currentStyle }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStyleMatches = async () => {
            setLoading(true);
            try {
                // Dispatch to the AI-powered backend endpoint
                const response = await fetch(`/api/recommendations/style?productId=${productId}&style=${currentStyle}`);
                
                if (!response.ok) throw new Error('Failed to fetch style recommendations');
                
                const data = await response.json();
                setRecommendations(data.items || []);
            } catch (err) {
                console.error('Style Match Engine Error:', err);
                setError('Unable to load style recommendations at this time.');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchStyleMatches();
        }
    }, [productId, currentStyle]);

    // Render skeleton loaders while the AI computes matches
    if (loading) {
        return (
            <div className="style-match-container mt-5 p-4" style={{ backgroundColor: '#fdfbf7', borderRadius: '12px' }}>
                <h4 className="mb-3 text-muted">Curating your perfect space...</h4>
                <div className="d-flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="skeleton-card flex-shrink-0" style={{ width: '220px', height: '300px', backgroundColor: '#eaeaea', borderRadius: '8px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    // Fail silently if the engine errors out or returns no matches to avoid disrupting the PDP
    if (error || recommendations.length === 0) return null; 

    return (
        <div className="style-match-container mt-5 p-4" style={{ backgroundColor: '#fdfbf7', borderRadius: '12px' }}>
            <div className="d-flex align-items-center mb-2">
                <span className="me-2" style={{ color: '#c77b30' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                </span>
                <h3 className="h3 mb-0 fw-bold">Complete The Look</h3>
            </div>
            <p className="text-muted small mb-4">Our interior design AI suggests these pieces to perfectly complement your selection.</p>
            
            <div className="d-flex overflow-auto pb-3 gap-4 style-carousel" style={{ scrollbarWidth: 'thin' }}>
                {recommendations.map(item => (
                    <div key={item.id} className="product-card flex-shrink-0" style={{ width: '220px' }}>
                        <div className="product-image position-relative mb-3 bg-white rounded shadow-sm overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="img-fluid" 
                                style={{ objectFit: 'cover', height: '220px', width: '100%', mixBlendMode: 'multiply' }} 
                            />
                            <button 
                                className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-2 shadow-sm rounded-circle d-flex justify-content-center align-items-center" 
                                style={{ width: '35px', height: '35px', color: '#c77b30' }}
                                aria-label={`Add ${item.name} to cart`}
                                onClick={() => window.addToCart && window.addToCart(item)}
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div>
                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                {item.category}
                            </small>
                            <h6 className="mb-1 text-truncate" title={item.name} style={{ fontSize: '1rem' }}>
                                {item.name}
                            </h6>
                            <p className="price fw-bold mb-0" style={{ color: '#111' }}>
                                ${item.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StyleMatchCarousel;
