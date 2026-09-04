import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';
import EMIPlanCard from '../EMIPlanCard';

describe('Frontend Component Tests', () => {
  it('renders product card with name, brand, and starting price', () => {
    const product = {
      _id: '1',
      name: 'Apple iPhone 17 Pro',
      brand: 'Apple',
      thumbnail: '/assets/iphone-natural.svg',
      category: 'Smartphones',
      description: 'Titanium design with A19 chip',
      startingPrice: 127400
    };

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Apple iPhone 17 Pro/i)).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText(/MF Backed EMI/i)).toBeInTheDocument();
  });

  it('renders EMI plan card with tenure, monthly amount, and cashback', () => {
    const plan = {
      _id: 'plan-1',
      monthlyAmount: 44967,
      tenureMonths: 3,
      interestRate: 0,
      cashback: 7500,
      isPopular: true
    };

    render(
      <EMIPlanCard plan={plan} checked={true} onChange={() => {}} />
    );

    expect(screen.getByText(/44,967/i)).toBeInTheDocument();
    expect(screen.getByText(/x 3 months/i)).toBeInTheDocument();
    expect(screen.getByText(/0% interest/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional cashback of ₹7,500/i)).toBeInTheDocument();
    expect(screen.getByText(/Most Popular/i)).toBeInTheDocument();
  });
});
