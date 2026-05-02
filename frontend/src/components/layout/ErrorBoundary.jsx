import React from 'react';
import { Button, Result } from 'antd';

/**
 * ErrorBoundary: Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface_dim p-6">
          <Result
            status="error"
            title="Oops! Something went sideways."
            subTitle={
              <div className="flex flex-col gap-2">
                <p>Our candy machines had a little hiccup, but don't worry, your orders are safe!</p>
                {this.state.error && (
                  <div className="mt-4 p-4 bg-error/10 text-error rounded-xl text-left font-mono text-xs overflow-auto max-w-lg">
                    {this.state.error.toString()}
                  </div>
                )}
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="home" 
                onClick={this.handleReset}
                className="rounded-full h-12 px-8 font-bold"
              >
                Back to Sweetness
              </Button>
            ]}
          />
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
