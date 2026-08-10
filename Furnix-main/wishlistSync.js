/**
 * Furnix Wishlist Synchronization Utility
 * Handles the bidirectional merging of local and remote wishlists during authentication.
 */

const LOCAL_WISHLIST_KEY = 'cara_local_wishlist';

/**
 * Synchronizes the local storage wishlist with the backend upon successful login.
 * To be called inside the <AuthProvider /> resolution pipeline.
 * 
 * @param {string} userToken - The authenticated user's JWT or session token
 * @param {function} dispatchWishlist - The state updater function for the <WishlistProvider />
 */
export const syncWishlistOnLogin = async (userToken, dispatchWishlist) => {
    try {
        // 1. Extract the highly valuable local wishlist built mid-session
        const localWishlistRaw = localStorage.getItem(LOCAL_WISHLIST_KEY);
        const localWishlist = localWishlistRaw ? JSON.parse(localWishlistRaw) : [];

        // 2. Dispatch silent POST /api/wishlist/merge if local items exist
        if (localWishlist.length > 0) {
            const response = await fetch('/api/wishlist/merge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ items: localWishlist })
            });

            if (!response.ok) {
                throw new Error('Failed to merge wishlist data with backend');
            }

            const mergedData = await response.json();

            // 3. Update global state with the mathematically merged list
            // (Assuming the API returns { wishlist: [...] })
            dispatchWishlist({ type: 'SET_WISHLIST', payload: mergedData.wishlist });

            // 4. Safely clear local storage after a successful sync to prevent duplicate data
            localStorage.removeItem(LOCAL_WISHLIST_KEY);
        } else {
            // 5. Fallback: If local is empty, just fetch the existing remote wishlist
            const response = await fetch('/api/wishlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });
            
            if (response.ok) {
                const remoteData = await response.json();
                dispatchWishlist({ type: 'SET_WISHLIST', payload: remoteData.wishlist });
            }
        }
    } catch (error) {
        console.error('Wishlist Sync Error: Catastrophic merge failure avoided.', error);
        // Optional: Trigger a UI toast notifying the user that the merge is retrying
    }
};
