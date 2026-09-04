import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can integrate Sentry or other logging here
    console.error('Uncaught error in component tree:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // optionally force a full reload
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white rounded shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred. You can retry or refresh the page.</p>
            <div className="flex justify-center gap-3">
              <button onClick={this.handleRetry} className="px-4 py-2 bg-accent text-white rounded">Retry</button>
              <button onClick={() => window.location.href = '/'} className="px-4 py-2 border rounded">Go Home</button>
            </div>
            <pre className="mt-4 text-xs text-left text-red-600 overflow-x-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
