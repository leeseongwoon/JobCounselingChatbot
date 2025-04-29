import { NextResponse, NextRequest } from 'next/server';
import { questionsData, Question } from '@/data/questions'; // Question 타입 추가

// 임시 데이터 저장소 (실제로는 DB 사용 권장)
// 다른 라우트에서 사용할 수 있도록 export 추가
export let questions: Question[] = [...questionsData];

// 재귀적으로 부모 질문을 찾는 함수
function findParentAndAddChild(items: Question[], parentId: string, child: Question): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === parentId) {
      // 부모를 찾으면 children 배열에 추가 (children이 없으면 생성)
      if (!items[i].children) {
        items[i].children = [];
      }
      items[i].children!.push(child);
      return true; // 추가 성공
    }
    // 하위 항목에서 재귀적으로 검색
    if (items[i].children && items[i].children!.length > 0) {
      const added = findParentAndAddChild(items[i].children!, parentId, child);
      if (added) return true;
    }
  }
  return false; // 부모를 찾지 못함
}

export async function GET() {
  // 현재 질문 목록을 반환합니다.
  return NextResponse.json(questions);
}

// POST 요청 핸들러: 새 질문 추가 (parentId 처리 추가)
export async function POST(request: NextRequest) {
  try {
    // parentId 추가
    const { text, answer, parentId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: '질문 내용은 필수입니다.' }, { status: 400 });
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: text,
      answer: answer || undefined,
      children: [],
    };

    let added = false;
    if (parentId) {
      // parentId가 있으면 해당 부모 하위에 추가 시도
      added = findParentAndAddChild(questions, parentId, newQuestion);
      if (!added) {
         return NextResponse.json({ error: `부모 질문(ID: ${parentId})을 찾을 수 없습니다.` }, { status: 404 });
      }
    } else {
      // parentId가 없으면 최상위 레벨에 추가
      questions.push(newQuestion);
      added = true;
    }

    // 성공 시 생성된 질문 반환 (201 상태 코드 사용)
    return NextResponse.json(newQuestion, { status: 201 });

  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json({ error: '질문 추가 중 오류 발생' }, { status: 500 });
  }
}

// TODO: PUT, DELETE 메소드 구현 필요 