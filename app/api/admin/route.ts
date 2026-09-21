import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

// POST 요청으로 학원 ID, 시간표, 수강료를 받아 DB에 저장
export async function POST(request: Request) {
  try {
    const { id, timetable, pricing } = await request.json();

    await query(
      `insert into academy_info (id, timetable, pricing) 
       values ($1, $2, $3) 
       on conflict (id) do update set timetable = $2, pricing = $3`,
      [id, JSON.stringify(timetable), JSON.stringify(pricing)]
    );

    return NextResponse.json({ success: true, message: '학원 정보가 성공적으로 저장되었습니다!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: '저장 실패' }, { status: 500 });
  }
}