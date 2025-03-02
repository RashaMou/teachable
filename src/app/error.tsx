"use client";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <h2 className="text-red-700">Something went wrong</h2>
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer">Show error details</summary>
            <pre className="mt-2 overflow-auto bg-gray-100 p-2 text-xs">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
