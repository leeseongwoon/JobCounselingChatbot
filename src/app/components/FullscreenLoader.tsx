"use client";

import { useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
`;

const LoaderContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  color: #2b6cb0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Message = styled.p`
  color: #4a5568;
  margin-top: 1rem;
`;

const SpinnerWrapper = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin: 0 auto;
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

interface FullscreenLoaderProps {
  title?: string;
  message?: string;
}

export default function FullscreenLoader({
  title = "Job Counseling Chatbot",
  message = "데이터를 불러오는 중입니다..."
}: FullscreenLoaderProps) {
  // 컴포넌트가 마운트될 때 body 스크롤 방지
  useEffect(() => {
    // 기존 overflow 값 저장
    const originalOverflow = document.body.style.overflow;
    // 스크롤 방지
    document.body.style.overflow = "hidden";
    
    // 컴포넌트가 언마운트될 때 원래 상태로 복원
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <Overlay>
      <LoaderContent>
        <Title>{title}</Title>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
        <Message>{message}</Message>
      </LoaderContent>
    </Overlay>
  );
} 