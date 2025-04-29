import { NextResponse, NextRequest } from 'next/server';
import { Question } from '@/data/questions';
import { questions } from '../dataStore';

// !! 주의: 이 데이터는 요청 간에 공유되지 않을 수 있습니다.
// 실제 애플리케이션에서는 DB를 사용해야 합니다.

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
      items.splice(i, 1);
      return true;
    }
    if (items[i].children && items[i].children!.length > 0) {
      const deleted = findQuestionAndDelete(items[i].children!, id);
      if (deleted) return true;
    }
  }
  return false;
}

// GET 요청 핸들러
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
  
  const question = findQuestion(questions, id);
  if (question) {
    return NextResponse.json(question);
  } else {
    return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
  }
}

// PUT 요청 핸들러
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { text, answer } = await request.json();
    if (text === undefined || text.trim() === '') {
       return NextResponse.json({ error: '질문 내용은 필수입니다.' }, { status: 400 });
    }
    const updatedQuestion = findQuestionAndUpdate(questions, id, text, answer);
    if (!updatedQuestion) {
      return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: '질문 수정 중 오류 발생' }, { status: 500 });
  }
}

// DELETE 요청 핸들러
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const deleted = findQuestionAndDelete(questions, id);
    if (!deleted) {
      return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: '질문 삭제 중 오류 발생' }, { status: 500 });
  }
} 