import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <div className="bg-red-800 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
              <pre className="text-sm overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            <div className="bg-red-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Stack Trace:</h2>
              <pre className="text-sm overflow-auto">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;