import { NextResponse, NextRequest } from 'next/server';
import { Question } from '@/data/questions';
import { questions } from '../route'; // export된 questions 직접 사용

// !! 주의: 이 데이터는 요청 간에 공유되지 않을 수 있습니다.
// 실제 애플리케이션에서는 DB를 사용해야 합니다.

interface Params {
  id: string;
}

// 재귀적으로 질문을 찾는 함수 (수정용)
function findQuestionAndUpdate(items: Question[], id: string, text: string, answer: string | undefined): Question | null {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items[i] = { ...items[i], text, answer };
      return items[i];
    }
    if (items[i].children && items[i].children!.length > 0) {
      const found = findQuestionAndUpdate(items[i].children!, id, text, answer);
      if (found) return found;
    }
  }
  return null;
}

// 재귀적으로 질문을 찾는 함수 (삭제용)
function findQuestionAndDelete(items: Question[], id: string): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items.splice(i, 1); // 배열에서 제거
      return true; // 찾아서 삭제 성공
    }
    if (items[i].children && items[i].children!.length > 0) {
      const deleted = findQuestionAndDelete(items[i].children!, id);
      if (deleted) return true; // 하위 트리에서 삭제 성공
    }
  }
  return false; // 현재 레벨 및 하위 트리에서 못 찾음
}

// GET 요청 핸들러 (개별 질문 조회 - 재귀 검색)
export async function GET(request: NextRequest, { params }: { params: Params }) {
  function findQuestion(items: Question[], id: string): Question | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findQuestion(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  const question = findQuestion(questions, params.id);
  if (question) {
    return NextResponse.json(question);
  } else {
    return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
  }
}

// PUT 요청 핸들러 (질문 수정 - 재귀 적용)
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { text, answer } = await request.json();

    // 간단한 유효성 검사
    if (text === undefined || text.trim() === '') {
       return NextResponse.json({ error: '질문 내용은 필수입니다.' }, { status: 400 });
    }

    // 재귀 함수를 사용하여 질문 업데이트
    const updatedQuestion = findQuestionAndUpdate(questions, params.id, text, answer);

    if (!updatedQuestion) {
      return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion);

  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: '질문 수정 중 오류 발생' }, { status: 500 });
  }
}

// DELETE 요청 핸들러 (질문 삭제 - 재귀 적용)
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    // 재귀 함수를 사용하여 질문 삭제
    const deleted = findQuestionAndDelete(questions, params.id);

    if (!deleted) {
      return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 성공적으로 삭제되었음을 알림 (204 No Content)
    // 주의: 실제 데이터가 questions 배열에서 직접 수정됨
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: '질문 삭제 중 오류 발생' }, { status: 500 });
  }
} 