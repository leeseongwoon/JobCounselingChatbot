"use client";

import { useEffect } from "react";
import {
  Overlay,
  LoaderContent,
  Title,
  Message,
  SpinnerWrapper,
  Spinner
} from "../styles/LoaderStyles";

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