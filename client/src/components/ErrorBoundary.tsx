import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Icon } from '@iconify/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: 2,
            p: 4,
          }}
        >
          <Box sx={{ color: 'error.main', opacity: 0.7 }}>
            <Icon icon="solar:danger-triangle-bold-duotone" width={56} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            Что-то пошло не так
          </Typography>
          {this.state.error && (
            <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 400, textAlign: 'center' }}>
              {this.state.error.message}
            </Typography>
          )}
          <Button variant="outlined" onClick={this.handleReset} sx={{ mt: 1 }}>
            Попробовать снова
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
