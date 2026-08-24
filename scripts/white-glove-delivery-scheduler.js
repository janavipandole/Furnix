/**
 * White-Glove Premium Assembly & Delivery Time Slot Scheduler Engine for Furnix
 * Manages specialized freight delivery options, room-of-choice placement,
 * debris removal, custom appointment time windows, and regional delivery charges.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WhiteGloveDeliveryScheduler = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DELIVERY_TIERS = [
    {
      id: 'standard-curbside',
      name: 'Standard Curbside Drop-off',
      price: 0,
      minOrderFree: 150,
      leadTimeDays: 5,
      features: ['Contactless front-door or driveway drop-off', 'Tracking alerts via SMS/Email', 'No appointment slot required'],
      description: 'Items delivered safely to your curb or driveway.'
    },
    {
      id: 'room-of-choice',
      name: 'Inside Room-of-Choice Delivery',
      price: 49.00,
      minOrderFree: 999,
      leadTimeDays: 4,
      features: ['2-person team carries items inside', 'Up to 2 flights of stairs included', 'Specific morning or afternoon appointment'],
      description: 'Placed precisely into your chosen living room, bedroom, or office.'
    },
    {
      id: 'white-glove-full',
      name: 'White-Glove Assembly & Packaging Removal',
      price: 119.00,
      minOrderFree: 1800,
      leadTimeDays: 3,
      features: ['Inside placement in designated room', 'Full piece unboxing and expert assembly', 'Eco-friendly cardboard and foam debris removal', 'Inspection & leveling verification'],
      description: 'Complete luxury setup: unboxed, assembled, inspected, and all debris removed.'
    }
  ];

  const TIME_WINDOWS = [
    { id: 'morning', label: 'Morning Slot', timeRange: '08:00 AM - 12:00 PM', surcharge: 0 },
    { id: 'afternoon', label: 'Afternoon Slot', timeRange: '12:00 PM - 04:00 PM', surcharge: 0 },
    { id: 'evening-priority', label: 'Evening Priority', timeRange: '04:00 PM - 08:00 PM', surcharge: 25.00 },
    { id: 'weekend-guaranteed', label: 'Saturday / Sunday Guaranteed', timeRange: '09:00 AM - 02:00 PM', surcharge: 35.00 }
  ];

  /**
   * Calculates estimated delivery date based on lead time and optional blackout days (Sundays).
   *
   * @param {number} leadDays - Number of processing and transit days
   * @param {Date} [baseDate=new Date()] - Starting date
   * @returns {Date} Target delivery date object
   */
  function calculateDeliveryDate(leadDays, baseDate = new Date()) {
    const target = new Date(baseDate.getTime());
    let addedDays = 0;
    while (addedDays < leadDays) {
      target.setDate(target.getDate() + 1);
      // Skip Sundays if standard transit
      if (target.getDay() !== 0) {
        addedDays++;
      }
    }
    return target;
  }

  /**
   * Calculates delivery fee breakdown based on order subtotal, selected tier, and appointment slot.
   *
   * @param {number} orderSubtotal - Cart or order total ($)
   * @param {string} [tierId='standard-curbside'] - Delivery service tier ID
   * @param {string} [slotId='morning'] - Preferred delivery time window ID
   * @returns {Object} Delivery options and cost summary
   */
  function calculateDeliveryQuote(orderSubtotal, tierId = 'standard-curbside', slotId = 'morning') {
    const subtotal = typeof orderSubtotal === 'number' && !isNaN(orderSubtotal) ? Math.max(0, orderSubtotal) : 0;
    const tier = DELIVERY_TIERS.find(t => t.id === tierId) || DELIVERY_TIERS[0];
    const slot = TIME_WINDOWS.find(s => s.id === slotId) || TIME_WINDOWS[0];

    const isFreeTier = subtotal >= tier.minOrderFree && tier.id === 'standard-curbside';
    const baseFee = isFreeTier ? 0 : tier.price;
    const slotSurcharge = slot.surcharge;
    const totalDeliveryCost = baseFee + slotSurcharge;
    const grandTotal = subtotal + totalDeliveryCost;

    const estDate = calculateDeliveryDate(tier.leadTimeDays);
    const estDateStr = estDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return {
      orderSubtotal: Number(subtotal.toFixed(2)),
      tierId: tier.id,
      tierName: tier.name,
      baseFee: Number(baseFee.toFixed(2)),
      slotId: slot.id,
      slotLabel: slot.label,
      slotTimeRange: slot.timeRange,
      slotSurcharge: Number(slotSurcharge.toFixed(2)),
      totalDeliveryCost: Number(totalDeliveryCost.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      isFreeDelivery: totalDeliveryCost === 0,
      estimatedDeliveryDate: estDateStr,
      features: tier.features
    };
  }

  /**
   * Retrieves all available service tiers with personalized pricing for a given order amount.
   *
   * @param {number} orderSubtotal - Cart value
   * @returns {Array<Object>} List of delivery tier options
   */
  function getAvailableTiers(orderSubtotal) {
    const subtotal = typeof orderSubtotal === 'number' && !isNaN(orderSubtotal) ? Math.max(0, orderSubtotal) : 0;
    return DELIVERY_TIERS.map(tier => {
      const isFree = subtotal >= tier.minOrderFree && tier.id === 'standard-curbside';
      return {
        ...tier,
        effectivePrice: isFree ? 0 : tier.price,
        isFreeEligible: isFree
      };
    });
  }

  return {
    calculateDeliveryQuote,
    getAvailableTiers,
    calculateDeliveryDate,
    DELIVERY_TIERS,
    TIME_WINDOWS
  };
});
