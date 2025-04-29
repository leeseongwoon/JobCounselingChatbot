import { Question, questionsData } from '@/data/questions';

// 임시 데이터 저장소 (실제로는 DB 사용 권장)
// 이 배열은 API 요청에 의해 직접 수정됩니다.
// eslint-disable-next-line prefer-const -- API 핸들러에서 배열 내용이 수정됩니다.
export let questions: Question[] = [...questionsData]; 