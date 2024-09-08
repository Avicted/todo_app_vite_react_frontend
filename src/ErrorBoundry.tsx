import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

// ErrorBoundary component to catch errors in the component tree
class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    // Catch errors in the component tree
    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    // Log the error to the console
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    // Render the children if no errors
    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please try again later.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
