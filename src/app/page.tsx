'use client';

import styled from 'styled-components';
// import { questionsData, Question } from '@/data/questions'; // 제거
import { Question } from '@/data/questions'; // Question 타입만 유지
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  options?: Question[];
}

// 최상위 Wrapper 정의
const PageWrapper = styled.div`
  background-color: #f9fafb;
  height: calc(100vh - 4rem);
  margin: 2rem 0;
  display: grid;
  /* place-items: center; */
  justify-items: center; /* 수평 중앙 정렬 */
  align-items: stretch; /* 수직으로 늘리기 (기본값) */
`;

const Container = styled.div`
  max-width: 800px;
  padding: 0 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%; // PageWrapper 그리드 아이템 높이를 채움
  background-color: #ffffff; // 배경색 추가
  overflow: hidden; // 내부 요소가 넘치지 않도록
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: normal;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
  flex-shrink: 0;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto; // 스크롤 적용
  padding: 0 1rem;
  margin-bottom: 1rem;

  /* Webkit 브라우저 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* 스크롤바 트랙 배경 투명 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 스크롤바 썸 색상 (약간 투명한 검정) */
    border-radius: 3px; /* 스크롤바 썸 둥근 모서리 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 호버 시 썸 색상 더 진하게 */
  }

  /* Firefox 스크롤바 스타일링 (선택 사항) */
  scrollbar-width: thin; /* 스크롤바 얇게 */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* 썸 색상, 트랙 투명 */
`;

const MessageBubble = styled.div<{ $sender: 'user' | 'bot' }>`
  max-width: 70%;
  padding: 0.8rem 1rem;
  border-radius: 18px;
  margin-bottom: 0.8rem;
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 1rem;
  
  ${({ $sender }) => $sender === 'user' ? `
    background-color: #e2e8f0;
    color: #2d3748;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : `
    background-color: #4299e1;
    color: white;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}
`;

const OptionsContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
`;

const OptionsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const OptionButton = styled.button`
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  color: #2c5282;
  padding: 0.6rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NavButton = styled.button`
  background-color: #4a5568;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #2d3748;
  }

  &:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
  }
`;

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
            const response = await fetch('/api/questions', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('질문 데이터를 불러오는 데 실패했습니다.');
            }
            const data: Question[] = await response.json();
            setAllQuestions(data);
            setCurrentOptions(data); // 초기 옵션을 로드된 데이터로 설정

            // 초기 메시지 설정
            const initialBotMessage: Message = {
                id: uuidv4(),
                sender: 'bot',
                text: '안녕하세요! 취업, 학습, 진로와 관련하여 궁금한 점이 있으신가요? 아래에서 질문을 선택해주세요.',
                options: data // 초기 옵션 설정
            };
            setConversation([initialBotMessage]);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('질문 데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.');
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
      sender: 'user',
      text: question.text,
    };

    const botMessage: Message = {
      id: uuidv4(),
      sender: 'bot',
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
      sender: 'bot',
      text: '안녕하세요! 취업, 학습, 진로와 관련하여 궁금한 점이 있으신가요? 아래에서 질문을 선택해주세요.',
      options: allQuestions // 로드된 전체 질문 사용
    };
    setConversation([initialBotMessage]);
    setCurrentOptions(allQuestions); // 로드된 전체 질문 사용
    setOptionsHistory([]);
  };

  // 로딩 및 에러 상태 처리 추가
  if (loading) {
    return <PageWrapper><Container><Title>로딩 중...</Title></Container></PageWrapper>;
  }

  if (error) {
     return <PageWrapper><Container><Title>오류 발생</Title><p style={{textAlign: 'center', color: 'red'}}>{error}</p></Container></PageWrapper>;
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
              <NavButton onClick={handleBack} disabled={optionsHistory.length === 0}>
                뒤로 가기
              </NavButton>
              <NavButton onClick={handleHome}>
                처음으로
              </NavButton>
            </NavigationButtons>
        </OptionsContainer>
      </Container>
    </PageWrapper>
  );
}
