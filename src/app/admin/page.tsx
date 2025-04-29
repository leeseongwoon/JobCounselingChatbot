'use client'; // 클라이언트 컴포넌트로 변경

import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '@/data/questions'; // Question 타입 import
import FullscreenLoader from '../components/FullscreenLoader';

// ===================================
// QuestionItem 재귀 컴포넌트
// ===================================
interface QuestionItemProps {
  question: Question;
  level: number;
  editingQuestionId: string | null;
  editText: string;
  editAnswer: string;
  updatingQuestion: boolean;
  updateError: string | null;
  deletingQuestionId: string | null;
  onEditStart: (question: Question) => void;
  onEditCancel: () => void;
  onUpdateQuestion: (e: React.FormEvent) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  setEditText: (text: string) => void;
  setEditAnswer: (answer: string) => void;
  addingChildToParentId: string | null;
  newChildText: string;
  newChildAnswer: string;
  addingChild: boolean;
  addChildError: string | null;
  onStartAddChild: (parentId: string) => void;
  onCancelAddChild: () => void;
  onAddChildQuestion: (e: React.FormEvent) => Promise<void>;
  setNewChildText: (text: string) => void;
  setNewChildAnswer: (answer: string) => void;
  // TODO: 하위 질문 추가 기능 핸들러 추가
}

function QuestionItem({
  question,
  level,
  editingQuestionId,
  editText,
  editAnswer,
  updatingQuestion,
  updateError,
  deletingQuestionId,
  onEditStart,
  onEditCancel,
  onUpdateQuestion,
  onDeleteQuestion,
  setEditText,
  setEditAnswer,
  addingChildToParentId,
  newChildText,
  newChildAnswer,
  addingChild,
  addChildError,
  onStartAddChild,
  onCancelAddChild,
  onAddChildQuestion,
  setNewChildText,
  setNewChildAnswer,
}: QuestionItemProps) {
  const isEditing = editingQuestionId === question.id;
  const isDeleting = deletingQuestionId === question.id;
  const [isOpen, setIsOpen] = useState(false);
  const isAddingChildHere = addingChildToParentId === question.id;

  const hasChildren = question.children && question.children.length > 0;

  const toggleOpen = () => {
    if (isAddingChildHere) return;
    setIsOpen(!isOpen);
  };

  return (
    <li style={{
        borderBottom: level === 0 ? '1px solid #eee' : 'none', // 최상위 레벨만 구분선
        padding: `15px 0 15px ${level * 20}px`, // 들여쓰기
        marginLeft: level > 0 ? '10px' : '0', // 왼쪽 마진
        borderLeft: level > 0 ? '2px solid #eee' : 'none', // 왼쪽 구분선
    }}>
      {!isEditing && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isAddingChildHere ? '10px' : '0' }}>
          <div style={{ flexGrow: 1, cursor: hasChildren ? 'pointer' : 'default' }} onClick={hasChildren ? toggleOpen : undefined}>
            {hasChildren && (
              <span style={{ marginRight: '5px', display: 'inline-block', width: '1em' }}>{isOpen ? '▼' : '▶'}</span>
            )}
            <strong style={{ display: 'inline' }}>{question.text}</strong>
            {question.answer && <p style={{ margin: '5px 0 0', color: '#555', whiteSpace: 'pre-wrap', marginLeft: hasChildren ? 'calc(1em + 5px)' : '0' }}>{question.answer}</p>}
          </div>
          <div style={{ flexShrink: 0, marginLeft: '10px' }}>
            {/* 레벨 2 미만일 때만 하위 추가 버튼 표시 */}
            {level < 2 && (
              <button onClick={() => onStartAddChild(question.id)} style={{ padding: '5px 10px', marginRight: '5px', color: 'blue' }}>하위 추가</button>
            )}
            <button onClick={() => onEditStart(question)} style={{ padding: '5px 10px', marginRight: '5px' }}>수정</button>
            <button onClick={() => onDeleteQuestion(question.id)} disabled={isDeleting} style={{ padding: '5px 10px', color: 'red' }}>
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={onUpdateQuestion}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor={`editQuestionText-${question.id}`} style={{ display: 'block', marginBottom: '5px' }}>질문 수정:</label>
            <input
              type="text"
              id={`editQuestionText-${question.id}`}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor={`editQuestionAnswer-${question.id}`} style={{ display: 'block', marginBottom: '5px' }}>답변 수정:</label>
            <textarea
              id={`editQuestionAnswer-${question.id}`}
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" disabled={updatingQuestion} style={{ padding: '5px 10px', marginRight: '5px' }}>
            {updatingQuestion ? '저장 중...' : '저장'}
          </button>
          <button type="button" onClick={onEditCancel} style={{ padding: '5px 10px' }}>
            취소
          </button>
          {updateError && <p style={{ color: 'red', marginTop: '10px' }}>수정 오류: {updateError}</p>}
        </form>
      )}

      {isAddingChildHere && (
        <div style={{ marginLeft: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '5px', marginTop: '10px' }}>
          <h4>&lsquo;{question.text}&rsquo; 아래에 하위 질문 추가</h4>
          <form onSubmit={onAddChildQuestion}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor={`newChildText-${question.id}`} style={{ display: 'block', marginBottom: '5px' }}>새 질문 내용:</label>
              <input
                type="text"
                id={`newChildText-${question.id}`}
                value={newChildText}
                onChange={(e) => setNewChildText(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor={`newChildAnswer-${question.id}`} style={{ display: 'block', marginBottom: '5px' }}>새 답변 내용 (선택 사항):</label>
              <textarea
                id={`newChildAnswer-${question.id}`}
                value={newChildAnswer}
                onChange={(e) => setNewChildAnswer(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" disabled={addingChild} style={{ padding: '5px 10px', marginRight: '5px' }}>
              {addingChild ? '추가 중...' : '하위 질문 추가'}
            </button>
            <button type="button" onClick={onCancelAddChild} style={{ padding: '5px 10px' }}>
              취소
            </button>
            {addChildError && <p style={{ color: 'red', marginTop: '10px' }}>오류: {addChildError}</p>}
          </form>
        </div>
      )}

      {hasChildren && isOpen && !isEditing && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {question.children!.map((child) => (
            <QuestionItem
              key={child.id}
              question={child}
              level={level + 1}
              {...{
                editingQuestionId,
                editText,
                editAnswer,
                updatingQuestion,
                updateError,
                deletingQuestionId,
                onEditStart,
                onEditCancel,
                onUpdateQuestion,
                onDeleteQuestion,
                setEditText,
                setEditAnswer,
                addingChildToParentId,
                newChildText,
                newChildAnswer,
                addingChild,
                addChildError,
                onStartAddChild,
                onCancelAddChild,
                onAddChildQuestion,
                setNewChildText,
                setNewChildAnswer,
              }}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ===================================
// AdminPage 컴포넌트
// ===================================
export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 새 질문 상태
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAnswer, setNewQuestionAnswer] = useState('');
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // 수정 상태 (공통 사용)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [updatingQuestion, setUpdatingQuestion] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // 삭제 상태 (공통 사용)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 하위 질문 추가 상태 다시 추가
  const [addingChildToParentId, setAddingChildToParentId] = useState<string | null>(null);
  const [newChildText, setNewChildText] = useState('');
  const [newChildAnswer, setNewChildAnswer] = useState('');
  const [addingChild, setAddingChild] = useState(false);
  const [addChildError, setAddChildError] = useState<string | null>(null);

  // 데이터 로딩 함수
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
     try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('데이터를 불러오는 데 실패했습니다.');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열 비어 있음

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 질문 추가 핸들러 (최상위 레벨만 추가)
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingQuestion(true);
    setAddError(null);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newQuestionText, answer: newQuestionAnswer }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '질문 추가에 실패했습니다.');
      }
      // 성공 시 목록 새로고침 (더 간단한 상태 업데이트)
      await fetchQuestions();
      setNewQuestionText('');
      setNewQuestionAnswer('');
    } catch (err) {
         if (err instanceof Error) {
            setAddError(err.message);
        } else {
            setAddError('알 수 없는 오류가 발생했습니다.')
        }
    } finally {
      setAddingQuestion(false);
    }
  };

  // 하위 질문 추가 시작 핸들러 다시 추가
  const handleStartAddChild = useCallback((parentId: string) => {
    setAddingChildToParentId(parentId);
    setNewChildText('');
    setNewChildAnswer('');
    setAddChildError(null);
    setEditingQuestionId(null); // 다른 액션 취소
  }, []);

  // 하위 질문 추가 취소 핸들러 다시 추가
  const handleCancelAddChild = useCallback(() => {
    setAddingChildToParentId(null);
    setAddChildError(null);
  }, []);

  // 하위 질문 추가 저장 핸들러 다시 추가
  const handleAddChildQuestion = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingChildToParentId) return;

    setAddingChild(true);
    setAddChildError(null);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newChildText,
          answer: newChildAnswer,
          parentId: addingChildToParentId, // 부모 ID 전달
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '하위 질문 추가에 실패했습니다.');
      }

      // 성공 시 목록 새로고침 및 폼 닫기
      await fetchQuestions();
      setAddingChildToParentId(null);

    } catch (err) {
      if (err instanceof Error) {
        setAddChildError(err.message);
      } else {
        setAddChildError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setAddingChild(false);
    }
  }, [addingChildToParentId, newChildText, newChildAnswer, fetchQuestions]);

  // 수정 시작 핸들러 (하위 추가 폼 닫기 추가)
  const handleEditStart = useCallback((question: Question) => {
    setEditingQuestionId(question.id);
    setEditText(question.text);
    setEditAnswer(question.answer || '');
    setUpdateError(null);
    setAddingChildToParentId(null); // 다른 액션 취소
  }, []);

  // 수정 취소 핸들러 (QuestionItem으로 전달)
  const handleEditCancel = useCallback(() => {
    setEditingQuestionId(null);
  }, []);

  // 질문 수정 저장 핸들러 (QuestionItem으로 전달)
  const handleUpdateQuestion = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestionId) return;

    setUpdatingQuestion(true);
    setUpdateError(null);

    try {
      const response = await fetch(`/api/questions/${editingQuestionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText, answer: editAnswer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '질문 수정에 실패했습니다.');
      }

      // 성공 시 목록 새로고침
      await fetchQuestions();
      setEditingQuestionId(null);
    } catch (err) {
      if (err instanceof Error) {
         setUpdateError(err.message);
      } else {
         setUpdateError('알 수 없는 오류가 발생했습니다.')
      }
      // 에러 발생 시 수정 모드 유지? 아니면 취소?
      // setEditingQuestionId(null); // 필요시 추가
    } finally {
      setUpdatingQuestion(false);
    }
  }, [editingQuestionId, editText, editAnswer, fetchQuestions]); // 의존성 추가

  // 질문 삭제 핸들러 (QuestionItem으로 전달)
  const handleDeleteQuestion = useCallback(async (id: string) => {
    if (!confirm('정말로 이 질문과 모든 하위 질문을 삭제하시겠습니까?')) {
      return;
    }

    setDeletingQuestionId(id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 204) {
          throw new Error(`질문 삭제 실패 (HTTP ${response.status})`);
      }

      // 성공 시 목록 새로고침
      await fetchQuestions();
    } catch (err) {
       if (err instanceof Error) {
         setDeleteError(err.message);
      } else {
         setDeleteError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setDeletingQuestionId(null);
    }
  }, [fetchQuestions]); // 의존성 추가

  // 로딩 상태 처리
  if (loading) {
    return <FullscreenLoader title="관리자 페이지" message="데이터를 불러오는 중입니다..." />;
  }

  // 에러 상태 처리
  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>관리자 페이지</h1>

      {/* 질문 추가 폼 (최상위 레벨) */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>새 질문 추가 (최상위)</h2>
        <form onSubmit={handleAddQuestion}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="newQuestionText" style={{ display: 'block', marginBottom: '5px' }}>질문 내용:</label>
            <input
              type="text"
              id="newQuestionText"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="newQuestionAnswer" style={{ display: 'block', marginBottom: '5px' }}>답변 내용 (선택 사항):</label>
            <textarea
              id="newQuestionAnswer"
              value={newQuestionAnswer}
              onChange={(e) => setNewQuestionAnswer(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" disabled={addingQuestion} style={{ padding: '8px 15px' }}>
            {addingQuestion ? '추가 중...' : '질문 추가'}
          </button>
          {addError && <p style={{ color: 'red', marginTop: '10px' }}>오류: {addError}</p>}
        </form>
      </div>

      <h2>질문 목록</h2>
      {deleteError && <p style={{ color: 'red' }}>삭제 오류: {deleteError}</p>}
      {/* 재귀 컴포넌트를 사용하여 목록 렌더링 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            level={0} // 최상위 레벨
            editingQuestionId={editingQuestionId}
            editText={editText}
            editAnswer={editAnswer}
            updatingQuestion={updatingQuestion}
            updateError={updateError}
            deletingQuestionId={deletingQuestionId}
            onEditStart={handleEditStart}
            onEditCancel={handleEditCancel}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            setEditText={setEditText}
            setEditAnswer={setEditAnswer}
            addingChildToParentId={addingChildToParentId}
            newChildText={newChildText}
            newChildAnswer={newChildAnswer}
            addingChild={addingChild}
            addChildError={addChildError}
            onStartAddChild={handleStartAddChild}
            onCancelAddChild={handleCancelAddChild}
            onAddChildQuestion={handleAddChildQuestion}
            setNewChildText={setNewChildText}
            setNewChildAnswer={setNewChildAnswer}
          />
        ))}
      </ul>
    </div>
  );
} 