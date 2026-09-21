"use client";

import React, { useState } from 'react';

const REGIONS: Record<string, Record<string, string[]>> = {
  '서울특별시': { '강남구': ['대치동', '도곡동'], '서초구': ['반포동', '서초동'], '송파구': ['잠실동', '방이동'], '양천구': ['목동'] },
  '부산광역시': { '해운대구': ['우동', '좌동'], '수영구': ['남천동'], '동래구': ['사직동'] },
  '대구광역시': { '수성구': ['범어동', '만촌동'], '달서구': ['상인동'] },
  '인천광역시': { '연수구': ['송도동'], '남동구': ['구월동'] },
  '광주광역시': { '남구': ['봉선동'], '광산구': ['수완동'] },
  '대전광역시': { '서구': ['둔산동', '월평동'], '유성구': ['관평동', '지족동', '반석동'] },
  '울산광역시': { '남구': ['옥동', '신정동'] },
  '세종특별자치시': { '세종시': ['새롬동', '아름동', '보람동'] },
  '경기도': { '성남시 분당구': ['정자동', '수내동'], '수원시 영통구': ['영통동', '이의동'], '고양시 일산동구': ['마두동', '백석동'], '안양시 동안구': ['평촌동'] },
  '강원특별자치도': { '춘천시': ['퇴계동', '석사동'], '원주시': ['무실동', '단구동'] },
  '충청북도': { '청주시 흥덕구': ['복대동'], '청주시 청원구': ['오창읍'] },
  '충청남도': { '천안시 서북구': ['불당동', '쌍용동'], '아산시': ['탕정면'] },
  '전북특별자치도': { '전주시 완산구': ['효자동'], '전주시 덕진구': ['송천동'] },
  '전라남도': { '순천시': ['연향동', '왕조동'], '목포시': ['옥암동'] },
  '경상북도': { '포항시 남구': ['효자동', '이동'], '구미시': ['형곡동'] },
  '경상남도': { '창원시 성산구': ['상남동'], '진주시': ['평거동'] },
  '제주특별자치도': { '제주시': ['노형동', '연동'], '서귀포시': ['동홍동'] }
};
const CATEGORIES = ['국어', '영어', '수학', '과학', '피아노', '미술', '태권도', '유도', '주짓수', '검도'];

export default function AcademyFinder() {
  const [city, setCity] = useState('서울특별시');
  const [district, setDistrict] = useState('강남구');
  const [neighborhood, setNeighborhood] = useState('대치동');
  const [category, setCategory] = useState('전체');
  
  const [results, setResults] = useState<any[]>([]);
  const [selectedAcademy, setSelectedAcademy] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    const newDistrict = Object.keys(REGIONS[newCity])[0];
    setDistrict(newDistrict);
    setNeighborhood(REGIONS[newCity][newDistrict][0]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setDistrict(newDistrict);
    setNeighborhood(REGIONS[city][newDistrict][0]);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const keyword = `${city} ${district} ${neighborhood} ${category === '전체' ? '' : category} 학원`;
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.documents) {
        // 백엔드에서 내려주는 데이터를 프론트엔드 상태에 정확히 매핑
        const transformedData = data.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.name,          // 학원 이름 명확하게 매핑
          address: doc.address,    // 주소 매핑
          phone: doc.phone,        // 전화번호 매핑
          image: `https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80`,
          type: category !== '전체' ? category : '학원',
          place_url: doc.place_url,
          timetable: doc.timetable,
          pricing: doc.pricing,
        }));
        setResults(transformedData);
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative pb-10">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-4">우리동네 학원 찾기</h1>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <select className="flex-1 border rounded p-2 text-sm" value={city} onChange={handleCityChange}>
              {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="flex-1 border rounded p-2 text-sm" value={district} onChange={handleDistrictChange}>
              {REGIONS[city] && Object.keys(REGIONS[city]).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="flex-1 border rounded p-2 text-sm" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
              {REGIONS[city][district]?.map((n: string) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <select className="border rounded p-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="전체">학원 종류 선택 (전체)</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? '검색 중...' : '조건에 맞는 학원 검색'}
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {results.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow p-3 flex gap-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setSelectedAcademy(item)}
          >
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex flex-col justify-center w-full overflow-hidden">
              <span className="text-xs font-semibold text-blue-600 mb-1">{item.type}</span>
              <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{item.address}</p>
              <p className="text-xs font-medium text-gray-700 mt-1">📞 {item.phone}</p>
            </div>
          </div>
        ))}
        {results.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-10">
            검색 버튼을 눌러 학원을 확인해보세요.
          </div>
        )}
      </div>

      {/* 상세 모달창 */}
      {selectedAcademy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md h-5/6 rounded-t-2xl p-5 overflow-y-auto relative pb-20">
            <button 
              className="absolute top-4 right-4 bg-gray-200 text-gray-700 rounded-full w-8 h-8 font-bold"
              onClick={() => setSelectedAcademy(null)}
            >
              ✕
            </button>
            <img src={selectedAcademy.image} alt={selectedAcademy.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold mb-1">{selectedAcademy.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedAcademy.address}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-3">🕒 학년별 시간표</h3>
              <div className="flex flex-col gap-2">
                {selectedAcademy.timetable.map((t: any, idx: number) => (
                  <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded text-sm">
                    <span className="font-semibold text-gray-700">{t.target}</span>
                    <span className="text-gray-600">{t.days} | {t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-3">💰 학년별 수강료</h3>
              <div className="flex flex-col gap-2">
                {selectedAcademy.pricing.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between bg-blue-50 p-3 rounded text-sm">
                    <span className="font-semibold text-gray-700">{p.grade}</span>
                    <span className="font-bold text-blue-700">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 카카오맵 연동 버튼 */}
            <a 
              href={selectedAcademy.place_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FAE100] text-[#371D1E] text-center font-bold py-4 rounded-lg mt-8 mb-4 shadow-sm hover:brightness-95 transition"
            >
              📍 카카오맵에서 상세 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}