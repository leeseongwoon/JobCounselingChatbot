import styled from "styled-components";

// 최상위 Wrapper 정의
export const PageWrapper = styled.div`
  background-color: #f9fafb;
  height: calc(100vh - 2rem);
  margin: 1rem 0;
  display: grid;
  justify-items: center; /* 수평 중앙 정렬 */
  align-items: stretch; /* 수직으로 늘리기 (기본값) */
`;

export const Container = styled.div`
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

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: normal;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
  flex-shrink: 0;
`;

export const MessageList = styled.div`
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
    background-color: rgba(
      0,
      0,
      0,
      0.3
    ); /* 스크롤바 썸 색상 (약간 투명한 검정) */
    border-radius: 3px; /* 스크롤바 썸 둥근 모서리 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 호버 시 썸 색상 더 진하게 */
  }

  /* Firefox 스크롤바 스타일링 (선택 사항) */
  scrollbar-width: thin; /* 스크롤바 얇게 */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* 썸 색상, 트랙 투명 */
`;

export const MessageBubble = styled.div<{ $sender: "user" | "bot" }>`
  max-width: 70%;
  padding: 0.8rem 1rem;
  border-radius: 18px;
  margin-bottom: 0.8rem;
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 1rem;

  ${({ $sender }) =>
    $sender === "user"
      ? `
    background-color: #e2e8f0;
    color: #2d3748;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  `
      : `
    background-color: #4299e1;
    color: white;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}
`;

export const OptionsContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
`;

export const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const OptionButton = styled.button`
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

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const AdminLinkContainer = styled.div`
  text-align: center;
  margin-bottom: 0.8rem;
`;

export const AdminLink = styled.a`
  color: #2b6cb0;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
    color: #2c5282;
  }
`;

export const NavButton = styled.button`
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