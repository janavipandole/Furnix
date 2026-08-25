/**
 * Financing & Installment EMI Calculator Engine for Furnix
 * Computes flexible monthly payment installments, interest rates (APR),
 * down payment deductions, and term plans (3, 6, 12, 24, 36 months)
 * for luxury furniture purchases.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FinancingCalculatorEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const FINANCING_TERMS = [
    {
      termMonths: 3,
      planName: '3-Month Interest-Free Plan',
      aprRate: 0.0,
      minPurchaseAmount: 150,
      description: 'Zero interest promotion when paid off in 3 monthly installments.'
    },
    {
      termMonths: 6,
      planName: '6-Month Promotional Plan',
      aprRate: 0.0,
      minPurchaseAmount: 300,
      description: '0% APR introductory rate for 6 months on qualifying furniture pieces.'
    },
    {
      termMonths: 12,
      planName: '12-Month Standard Flexible Plan',
      aprRate: 4.99,
      minPurchaseAmount: 500,
      description: 'Budget-friendly monthly payments spread across 1 year.'
    },
    {
      termMonths: 24,
      planName: '24-Month Extended Living Plan',
      aprRate: 7.99,
      minPurchaseAmount: 1000,
      description: 'Affordable long-term financing for full room & living sets.'
    },
    {
      termMonths: 36,
      planName: '36-Month Executive Suite Plan',
      aprRate: 9.99,
      minPurchaseAmount: 1800,
      description: 'Maximum installment flexibility for luxury collection setups.'
    }
  ];

  /**
   * Calculates precise monthly EMI, total interest, and grand total.
   * Standard EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
   * Where P = principal financed (Price - Down Payment), r = monthly interest rate, n = term in months.
   *
   * @param {number} purchasePrice - Product or order purchase price ($)
   * @param {number} [downPayment=0] - Initial down payment ($)
   * @param {number} [termMonths=12] - Number of installment months
   * @param {number} [customApr] - Optional APR override percentage (e.g. 4.99)
   * @returns {Object} Calculated financing breakdown
   */
  function calculateInstallment(purchasePrice, downPayment = 0, termMonths = 12, customApr = null) {
    const rawPrice = typeof purchasePrice === 'number' && !isNaN(purchasePrice) ? Math.max(0, purchasePrice) : 0;
    const rawDownPayment = typeof downPayment === 'number' && !isNaN(downPayment) ? Math.max(0, Math.min(rawPrice, downPayment)) : 0;
    const principalFinanced = Math.max(0, rawPrice - rawDownPayment);

    // Find term configuration or fallback
    const matchedTerm = FINANCING_TERMS.find(t => t.termMonths === termMonths) || {
      termMonths: termMonths,
      planName: `${termMonths}-Month Custom Plan`,
      aprRate: 5.99,
      minPurchaseAmount: 100,
      description: 'Custom duration installment plan.'
    };

    const apr = customApr !== null && typeof customApr === 'number' && !isNaN(customApr) ? Math.max(0, customApr) : matchedTerm.aprRate;

    if (principalFinanced === 0 || termMonths <= 0) {
      return {
        purchasePrice: Number(rawPrice.toFixed(2)),
        downPayment: Number(rawDownPayment.toFixed(2)),
        principalFinanced: 0,
        termMonths,
        planName: matchedTerm.planName,
        apr: apr,
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayable: Number(rawDownPayment.toFixed(2)),
        isZeroInterest: apr === 0,
        isEligible: true
      };
    }

    let monthlyPayment = 0;
    let totalPayable = 0;
    let totalInterest = 0;

    if (apr === 0) {
      monthlyPayment = principalFinanced / termMonths;
      totalPayable = principalFinanced + rawDownPayment;
      totalInterest = 0;
    } else {
      const monthlyRate = (apr / 100) / 12;
      const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (principalFinanced * monthlyRate * compoundFactor) / (compoundFactor - 1);
      const totalFinancedCost = monthlyPayment * termMonths;
      totalInterest = Math.max(0, totalFinancedCost - principalFinanced);
      totalPayable = totalFinancedCost + rawDownPayment;
    }

    const isEligible = rawPrice >= (matchedTerm.minPurchaseAmount || 100);

    return {
      purchasePrice: Number(rawPrice.toFixed(2)),
      downPayment: Number(rawDownPayment.toFixed(2)),
      principalFinanced: Number(principalFinanced.toFixed(2)),
      termMonths,
      planName: matchedTerm.planName,
      apr: Number(apr.toFixed(2)),
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2)),
      isZeroInterest: apr === 0,
      isEligible
    };
  }

  /**
   * Retrieves all available financing plan choices for a given product price and down payment.
   *
   * @param {number} purchasePrice - Product or order purchase price
   * @param {number} [downPayment=0] - Initial down payment
   * @returns {Array<Object>} List of available installment plans with computed payments
   */
  function getAvailablePlans(purchasePrice, downPayment = 0) {
    const rawPrice = typeof purchasePrice === 'number' && !isNaN(purchasePrice) ? Math.max(0, purchasePrice) : 0;
    const rawDownPayment = typeof downPayment === 'number' && !isNaN(downPayment) ? Math.max(0, downPayment) : 0;

    return FINANCING_TERMS.map(term => {
      const breakdown = calculateInstallment(rawPrice, rawDownPayment, term.termMonths, term.aprRate);
      return {
        ...breakdown,
        description: term.description,
        minPurchaseAmount: term.minPurchaseAmount
      };
    });
  }

  /**
   * Evaluates minimum qualifying price for interest-free promotions.
   *
   * @returns {number} Minimum qualifying price
   */
  function getZeroInterestThreshold() {
    return 150;
  }

  return {
    calculateInstallment,
    getAvailablePlans,
    getZeroInterestThreshold,
    FINANCING_TERMS
  };
});
