"use client";

import { Question } from "@/data/questions"; // Question 타입만 유지
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import FullscreenLoader from "./components/FullscreenLoader";
import {
  PageWrapper,
  Container,
  Title,
  MessageList,
  MessageBubble,
  OptionsContainer,
  OptionsGrid,
  OptionButton,
  NavigationButtons,
  AdminLinkContainer,
  AdminLink,
  NavButton
} from "./styles/ChatStyles";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  options?: Question[];
}

export default function Home() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // API로부터 모든 질문 로드
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  const [conversation, setConversation] = useState<Message[]>([]);
  // currentOptions 초기값을 빈 배열로 변경
  const [currentOptions, setCurrentOptions] = useState<Question[]>([]);
  const [optionsHistory, setOptionsHistory] = useState<Question[][]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);

  // API 호출하여 질문 데이터 로드
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      setError(null);
      try {
        // API 호출 시 캐시 사용 안 함 (항상 최신 데이터)
        const response = await fetch("/api/questions", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("질문 데이터를 불러오는 데 실패했습니다.");
        }
        const data: Question[] = await response.json();
        setAllQuestions(data);
        setCurrentOptions(data); // 초기 옵션을 로드된 데이터로 설정

        // 초기 메시지 설정
        const initialBotMessage: Message = {
          id: uuidv4(),
          sender: "bot",
          text: "안녕하세요! 취업, 학습, 진로와 관련하여 궁금한 점이 있으신가요? 아래에서 질문을 선택해주세요.",
          options: data, // 초기 옵션 설정
        };
        setConversation([initialBotMessage]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("질문 데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []); // 마운트 시 한 번만 실행

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleOptionClick = (question: Question) => {
    setOptionsHistory([...optionsHistory, currentOptions]);

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: question.text,
    };

    const botMessage: Message = {
      id: uuidv4(),
      sender: "bot",
      text: question.answer || "죄송합니다. 아직 답변이 준비되지 않았습니다.",
      options: question.children || [],
    };

    setConversation([...conversation, userMessage, botMessage]);
    setCurrentOptions(question.children || []);
  };

  const handleBack = () => {
    if (optionsHistory.length > 0) {
      const previousOptions = optionsHistory[optionsHistory.length - 1];
      const newHistory = optionsHistory.slice(0, -1);

      setCurrentOptions(previousOptions);
      setOptionsHistory(newHistory);
      setConversation(conversation.slice(0, -2));
    }
  };

  // handleHome 수정: API에서 로드한 allQuestions 사용
  const handleHome = () => {
    if (loading || error) return; // 데이터 로딩 중이거나 에러 시 동작 안 함
    const initialBotMessage: Message = {
      id: uuidv4(),
      sender: "bot",
      text: "안녕하세요! 취업, 학습, 진로와 관련하여 궁금한 점이 있으신가요? 아래에서 질문을 선택해주세요.",
      options: allQuestions, // 로드된 전체 질문 사용
    };
    setConversation([initialBotMessage]);
    setCurrentOptions(allQuestions); // 로드된 전체 질문 사용
    setOptionsHistory([]);
  };

  // 어드민 페이지로 이동하는 함수 추가
  const handleAdminPage = () => {
    window.location.href = "/admin";
  };

  // 로딩 및 에러 상태 처리 추가
  if (loading) {
    return <FullscreenLoader />;
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <Title>오류 발생</Title>
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Title>Job Counseling Chatbot</Title>

        <MessageList ref={messageListRef}>
          {conversation.map((msg) => (
            <MessageBubble key={msg.id} $sender={msg.sender}>
              {msg.text}
            </MessageBubble>
          ))}
        </MessageList>

        <OptionsContainer>
          <OptionsGrid>
            {currentOptions.map((question) => (
              <OptionButton
                key={question.id}
                onClick={() => handleOptionClick(question)}
              >
                {question.text}
              </OptionButton>
            ))}
          </OptionsGrid>
          <NavigationButtons>
            <NavButton
              onClick={handleBack}
              disabled={optionsHistory.length === 0}
            >
              뒤로 가기
            </NavButton>
            <NavButton onClick={handleHome}>처음으로</NavButton>
          </NavigationButtons>
          <AdminLinkContainer>
            <AdminLink onClick={handleAdminPage}>
              관리자 페이지로 이동
            </AdminLink>
          </AdminLinkContainer>
        </OptionsContainer>
      </Container>
    </PageWrapper>
  );
}
