"use client";

import styled from "styled-components";

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const LoadingTitle = styled.h2`
  color: #2b6cb0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
`;

const LoadingText = styled.p`
  color: #4a5568;
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingPageProps {
  title?: string;
  message?: string;
}

export default function LoadingPage({ 
  title = "Job Counseling Chatbot", 
  message = "데이터를 불러오는 중입니다..." 
}: LoadingPageProps) {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
  
  return (
    <FullScreenContainer>
      <LoadingContainer>
        <LoadingTitle>{title}</LoadingTitle>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        <LoadingText>{message}</LoadingText>
      </LoadingContainer>
    </FullScreenContainer>
  );
} 