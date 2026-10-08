import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParam = searchParams.get('query');

  if (!queryParam) {
    return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });
  }

  try {
    const kakaoRes = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(queryParam)}&category_group_code=AC5`, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });
    
    const kakaoData = await kakaoRes.json();

    if (!kakaoData.documents) {
      return NextResponse.json({ documents: [] });
    }

    const academyIds = kakaoData.documents.map((doc: any) => doc.id);

    let dbDataMap = new Map();
    if (academyIds.length > 0) {
      const placeholders = academyIds.map((id: any, i: number) => `$${i + 1}`).join(', ');
      const dbRes = await query(
        `select id, timetable, pricing from academy_info where id in (${placeholders})`,
        academyIds
      );
      
      dbRes.rows.forEach(row => {
        dbDataMap.set(row.id, {
          timetable: row.timetable,
          pricing: row.pricing
        });
      });
    }

    const transformedDocuments = kakaoData.documents.map((doc: any) => {
      const customData = dbDataMap.get(doc.id);
      
      // DB에 없는 학원들을 위해 자동으로 뿌려줄 대략적인 범위 데이터
      const defaultTimetable = [
        { target: '초등부', time: '오후 1:00 ~ 6:00 (학원별 상이)' },
        { target: '중등부', time: '오후 5:00 ~ 10:00 (학원별 상이)' },
        { target: '고등부', time: '오후 6:00 ~ 10:00 (학원별 상이)' }
      ];
      
      const defaultPricing = [
        { grade: '초/중/고 (단과/종합)', price: '약 15만 원 ~ 45만 원 (과목 및 시수별 상이)' }
      ];

      return {
        id: doc.id,
        name: doc.place_name,
        address: doc.road_address_name || doc.address_name,
        phone: doc.phone || '전화번호 미등록',
        type: '학원',
        place_url: doc.place_url,
        timetable: customData?.timetable || defaultTimetable,
        pricing: customData?.pricing || defaultPricing,
      };
    });

    return NextResponse.json({ documents: transformedDocuments });

  } catch (error) {
    console.error("데이터 검색 및 DB 조회 중 오류:", error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
