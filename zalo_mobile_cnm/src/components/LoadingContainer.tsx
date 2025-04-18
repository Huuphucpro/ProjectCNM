import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import LoadingIndicator from './LoadingIndicator';

interface LoadingContainerProps {
  children: ReactNode;
  loadingId?: string;
  fullscreenLoading?: boolean;
  customLoadingMessage?: string;
  showOverlay?: boolean;
}

/**
 * A container component that shows loading indicators based on Redux state
 */
const LoadingContainer: React.FC<LoadingContainerProps> = ({
  children,
  loadingId,
  fullscreenLoading = false,
  customLoadingMessage,
  showOverlay = true
}) => {
  const { isLoading, loadingIds, message } = useSelector(
    (state: RootState) => state.loading
  );

  // Determine if we should show loading
  const shouldShowLoading = loadingId
    ? loadingIds.includes(loadingId)
    : isLoading;

  // Get the loading message
  const loadingMessage = customLoadingMessage || message;

  return (
    <>
      {children}
      
      <LoadingIndicator
        loading={shouldShowLoading}
        message={loadingMessage}
        overlay={showOverlay}
        fullscreen={fullscreenLoading}
      />
    </>
  );
};

export default LoadingContainer; 