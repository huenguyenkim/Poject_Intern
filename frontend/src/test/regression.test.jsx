import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import * as AntdGlobal from '../utils/AntdGlobal';

// --- ErrorBoundary Tests ---

const ThrowingComponent = () => {
  throw new Error('Simulation Crash');
};

describe('ErrorBoundary Resilience', () => {
  it('should render the fallback UI when a child component crashes', () => {
    // Silence console.error for the expected crash logging
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went sideways/i)).toBeInTheDocument();
    expect(screen.getByText(/Our candy machines had a little hiccup/i)).toBeInTheDocument();
    
    // Verify that componentDidCatch logged the error
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

// --- Toast Notification Tests ---

describe('Notification System (Ant Design Integration)', () => {
  const mockMessage = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Initialize the global instances via the setter
    AntdGlobal.setAntdInstances({ 
      message: mockMessage, 
      notification: {}, 
      modal: {} 
    });
  });

  it('showSuccessToast should call the global message.success instance', () => {
    showSuccessToast('Sweet Success!');
    
    expect(mockMessage.success).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Sweet Success!',
        icon: '🧁',
        duration: 3
      })
    );
  });

  it('showErrorToast should call the global message.error instance', () => {
    showErrorToast('Bitter Failure');
    
    expect(mockMessage.error).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Bitter Failure',
        icon: '❌',
        duration: 5
      })
    );
  });
});
