import styled from 'styled-components';

export const AdminContainer = styled.div`
  padding: 20px;
`;

export const AdminTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

export const AdminSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #2b6cb0;
`;

export const FormGroup = styled.div`
  margin-bottom: 10px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
`;

export const Button = styled.button`
  padding: 8px 15px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2d3748;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

// QuestionItem 관련 스타일
export const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const QuestionItem = styled.li<{ level: number }>`
  border-bottom: ${props => props.level === 0 ? '1px solid #eee' : 'none'};
  padding: ${props => `15px 0 15px ${props.level * 20}px`};
  margin-left: ${props => props.level > 0 ? '10px' : '0'};
  border-left: ${props => props.level > 0 ? '2px solid #eee' : 'none'};
`;

export const QuestionItemHeader = styled.div<{ marginBottom?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.marginBottom || '0'};
`;

export const QuestionContent = styled.div<{ hasChildren: boolean }>`
  flex-grow: 1;
  cursor: ${props => props.hasChildren ? 'pointer' : 'default'};
`;

export const ToggleIcon = styled.span`
  margin-right: 5px;
  display: inline-block;
  width: 1em;
`;

export const QuestionText = styled.strong`
  display: inline;
`;

export const QuestionAnswer = styled.p<{ hasChildren: boolean }>`
  margin: 5px 0 0;
  color: #555;
  white-space: pre-wrap;
  margin-left: ${props => props.hasChildren ? 'calc(1em + 5px)' : '0'};
`;

export const ActionButtons = styled.div`
  flex-shrink: 0;
  margin-left: 10px;
`;

export const ChildButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  color: blue;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
`;

export const EditButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  padding: 5px 10px;
  color: red;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ChildFormContainer = styled.div`
  margin-left: 20px;
  padding: 15px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-top: 10px;
`;

export const ChildFormTitle = styled.h4`
  margin-bottom: 15px;
  color: #333;
`;

export const NestedList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`; 