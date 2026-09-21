import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParam = searchParams.get('query');

  if (!queryParam) {
    return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });
  }

  try {
    // 1. 카카오 장소 검색 API 호출
    const kakaoRes = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(queryParam)}&category_group_code=AC5`, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });
    
    const kakaoData = await kakaoRes.json();

    if (!kakaoData.documents) {
      return NextResponse.json({ documents: [] });
    }

    // 2. 카카오에서 받아온 학원 ID 목록 추출
    const academyIds = kakaoData.documents.map((doc: any) => doc.id);

    // 3. Neon DB에서 해당 학원들의 커스텀 시간표/수강료 데이터 조회
    let dbDataMap = new Map();
    if (academyIds.length > 0) {
      const placeholders = academyIds.map((_, i) => `$${i + 1}`).join(', ');
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

    // 4. 프론트엔드가 요구하는 이름(name, address)으로 정확히 매핑
    const transformedDocuments = kakaoData.documents.map((doc: any) => {
      const customData = dbDataMap.get(doc.id);
      return {
        id: doc.id,
        name: doc.place_name, // 학원 이름 필드명 명확히 고정
        address: doc.road_address_name || doc.address_name, // 주소 필드명 고정
        phone: doc.phone || '전화번호 미등록',
        image: `https://via.placeholder.com/150/3B82F6/FFFFFF?text=Academy`,
        type: '학원',
        place_url: doc.place_url,
        timetable: customData?.timetable || [{ target: '등록된 시간표가 없습니다', time: '-', days: '-' }],
        pricing: customData?.pricing || [{ grade: '등록된 수강료가 없습니다', price: '-' }],
      };
    });

    return NextResponse.json({ documents: transformedDocuments });

  } catch (error) {
    console.error("데이터 검색 및 DB 조회 중 오류:", error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}