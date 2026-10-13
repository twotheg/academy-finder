"use client";

import React, { useState, useEffect } from 'react';
import { REGIONS } from './lib/regions';

// 과목별 고유 색상 및 테마 매핑
const SUBJECT_STYLES: Record<string, string> = {
  수학: 'bg-blue-100 text-blue-800 border-blue-200',
  영어: 'bg-purple-100 text-purple-800 border-purple-200',
  국어: 'bg-amber-100 text-amber-800 border-amber-200',
  과학: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  사회: 'bg-lime-100 text-lime-800 border-lime-200',
  논술: 'bg-orange-100 text-orange-800 border-orange-200',
  코딩: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  피아노: 'bg-pink-100 text-pink-800 border-pink-200',
  음악: 'bg-pink-100 text-pink-800 border-pink-200',
  미술: 'bg-rose-100 text-rose-800 border-rose-200',
  태권도: 'bg-red-100 text-red-800 border-red-200',
  유도: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  주짓수: 'bg-slate-100 text-slate-800 border-slate-300',
  검도: 'bg-stone-100 text-stone-800 border-stone-300',
  어학원: 'bg-violet-100 text-violet-800 border-violet-200',
  독재: 'bg-teal-100 text-teal-800 border-teal-200',
  독학재수: 'bg-teal-100 text-teal-800 border-teal-200',
  기본: 'bg-amber-100 text-amber-800 border-amber-200',
};

// 학원 상호명에서 과목 키워드 자동 분석
function extractSubjects(name: string, selectedCategory: string): string[] {
  const subjects: string[] = [];

  if (selectedCategory && selectedCategory !== '전체') {
    subjects.push(selectedCategory);
  }

  if (name.includes('영어') || name.includes('어학') || name.includes('잉글리쉬') || name.includes('English')) {
    if (!subjects.includes('영어')) subjects.push('영어');
  }
  if (name.includes('수학') || name.includes('매쓰') || name.includes('Math')) {
    if (!subjects.includes('수학')) subjects.push('수학');
  }
  if (name.includes('영수')) {
    if (!subjects.includes('영어')) subjects.push('영어');
    if (!subjects.includes('수학')) subjects.push('수학');
  }
  if (name.includes('국어') || name.includes('논술')) {
    if (!subjects.includes('국어')) subjects.push('국어');
  }
  if (name.includes('과학') || name.includes('사이언스')) {
    if (!subjects.includes('과학')) subjects.push('과학');
  }
  if (name.includes('피아노') || name.includes('음악')) {
    if (!subjects.includes('피아노')) subjects.push('피아노');
  }
  if (name.includes('미술') || name.includes('아트')) {
    if (!subjects.includes('미술')) subjects.push('미술');
  }
  if (name.includes('태권도')) {
    if (!subjects.includes('태권도')) subjects.push('태권도');
  }
  if (name.includes('유도')) {
    if (!subjects.includes('유도')) subjects.push('유도');
  }
  if (name.includes('주짓수')) {
    if (!subjects.includes('주짓수')) subjects.push('주짓수');
  }
  if (name.includes('검도')) {
    if (!subjects.includes('검도')) subjects.push('검도');
  }
  if (name.includes('독재') || name.includes('독학재수') || name.includes('스터디')) {
    if (!subjects.includes('독학재수')) subjects.push('독학재수');
  }

  return subjects.length > 0 ? subjects : ['보습/입시'];
}

// 1. 메인 화면 최하단 고정형 광고 배너
const StickyBottomAd = () => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-white/95 backdrop-blur-sm border-t border-amber-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] py-2 px-3">
      <div className="w-full max-w-md flex flex-col items-center justify-center rounded-lg border border-dashed border-amber-400 bg-amber-50/70 h-[60px] text-center overflow-hidden">
        <span className="text-[10px] text-amber-800/70 font-semibold tracking-wider">SPONSORED AD</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '320px', height: '50px' }}
          data-ad-client="ca-pub-4424569297437395"
          data-ad-slot="1800426506"
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        ></ins>
      </div>
    </div>
  );
};

// 2. 모달 팝업 내부 하단 광고 박스
const ModalAdBox = () => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense Modal Error:', e);
    }
  }, []);

  return (
    <div className="w-full mt-4 mb-6 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-amber-400 bg-amber-100/50 min-h-[90px] text-center overflow-hidden">
      <span className="text-[10px] text-amber-800/70 font-semibold tracking-wider mb-1">SPONSORED AD</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '50px' }}
        data-ad-client="ca-pub-4424569297437395"
        data-ad-slot="1800426506"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

const CATEGORIES = ['국어', '영어', '수학', '과학', '피아노', '미술', '태권도', '유도', '주짓수', '검도'];

export default function AcademyFinder() {
  const [city, setCity] = useState('서울특별시');
  const [district, setDistrict] = useState('강남구');
  const [neighborhood, setNeighborhood] = useState('대치동');
  const [category, setCategory] = useState('전체');
  const [directKeyword, setDirectKeyword] = useState('');
  
  const [results, setResults] = useState<any[]>([]);
  const [selectedAcademy, setSelectedAcademy] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 관심 학원 목록(객체 배열) 관리
  const [favoriteList, setFavoriteList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  // 로컬 스토리지에서 관심 학원 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('academy_favorites_data');
      if (saved) {
        setFavoriteList(JSON.parse(saved));
      } else {
        localStorage.removeItem('academy_favorites');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 즐겨찾기 토글 (학원 전체 정보 저장/삭제)
  const toggleFavorite = (academy: any, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: any[];
    const exists = favoriteList.some((item) => item.id === academy.id);
    
    if (exists) {
      updated = favoriteList.filter((item) => item.id !== academy.id);
    } else {
      updated = [...favoriteList, academy];
    }
    
    setFavoriteList(updated);
    localStorage.setItem('academy_favorites_data', JSON.stringify(updated));
  };

  const isFavorite = (id: string) => favoriteList.some((item) => item.id === id);

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
    setActiveTab('search');
    
    const keyword = directKeyword.trim() 
      ? directKeyword 
      : `${city} ${district} ${neighborhood} ${category === '전체' ? '' : category} 학원`;
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.documents) {
        const transformedData = data.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          address: doc.address,
          phone: doc.phone,
          subjects: extractSubjects(doc.name, category),
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
    <div className="max-w-md mx-auto bg-[#FFFDF7] min-h-screen relative pb-28 shadow-sm">
      {/* 상단 탭 네비게이션 */}
      <div className="flex bg-white/90 backdrop-blur border-b border-amber-100 sticky top-0 z-20">
        <button 
          className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'search' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 학원 검색
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'favorites' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('favorites')}
        >
          ⭐ 관심 학원 ({favoriteList.length})
        </button>
      </div>

      {activeTab === 'search' ? (
        <>
          <div className="bg-white p-4 shadow-sm border-b border-amber-100">
            <h1 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-1.5">
              <span>🏫 우리동네 학원 찾기</span>
            </h1>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="학원 이름을 직접 입력하세요 (예: 한양수학)" 
                className="flex-1 border border-amber-200 bg-amber-50/30 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
                value={directKeyword}
                onChange={(e) => setDirectKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <select className="flex-1 border border-gray-200 bg-white rounded-lg p-2 text-sm" value={city} onChange={handleCityChange}>
                  {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="flex-1 border border-gray-200 bg-white rounded-lg p-2 text-sm" value={district} onChange={handleDistrictChange}>
                  {REGIONS[city] && Object.keys(REGIONS[city]).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="flex-1 border border-gray-200 bg-white rounded-lg p-2 text-sm" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
                  {REGIONS[city]?.[district]?.map((n: string) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <select className="border border-gray-200 bg-white rounded-lg p-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="전체">학원 종류 선택 (전체)</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button 
                onClick={handleSearch}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg mt-1 shadow-sm transition active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? '학원 정보 검색 중...' : '조건에 맞는 학원 찾기'}
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {results.map((item) => {
              const fav = isFavorite(item.id);
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm border border-amber-100/70 p-4 flex flex-col cursor-pointer hover:shadow-md hover:border-amber-300 transition relative"
                  onClick={() => setSelectedAcademy(item)}
                >
                  <div className="pr-8">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.subjects.map((sub: string, sIdx: number) => {
                        const colorClass = SUBJECT_STYLES[sub] || SUBJECT_STYLES['기본'];
                        return (
                          <span
                            key={sIdx}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded border ${colorClass}`}
                          >
                            {sub}
                          </span>
                        );
                      })}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 truncate">{item.address}</p>
                    <p className="text-xs font-semibold text-gray-700">📞 {item.phone}</p>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(item, e)}
                    className="absolute top-4 right-4 text-2xl focus:outline-none hover:scale-110 transition"
                    aria-label="즐겨찾기"
                  >
                    {fav ? '⭐' : '☆'}
                  </button>
                </div>
              );
            })}

            {results.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-16 text-sm">
                원하시는 지역이나 학원 이름을 검색해 보세요.
              </div>
            )}
          </div>
        </>
      ) : (
        /* 관심 학원 탭: 찜한 학원 카드 목록 출력 */
        <div className="p-4 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-base mb-1">⭐ 내가 찜한 관심 학원</h2>
          {favoriteList.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-sm bg-white rounded-xl border border-amber-100 p-8">
              아직 찜한 학원이 없습니다.<br/>검색 결과에서 별표(☆)를 눌러 등록해 보세요!
            </div>
          ) : (
            favoriteList.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm border border-amber-100/70 p-4 flex flex-col cursor-pointer hover:shadow-md hover:border-amber-300 transition relative"
                onClick={() => setSelectedAcademy(item)}
              >
                <div className="pr-8">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.subjects?.map((sub: string, sIdx: number) => {
                      const colorClass = SUBJECT_STYLES[sub] || SUBJECT_STYLES['기본'];
                      return (
                        <span
                          key={sIdx}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border ${colorClass}`}
                        >
                          {sub}
                        </span>
                      );
                    })}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">{item.address}</p>
                  <p className="text-xs font-semibold text-gray-700">📞 {item.phone}</p>
                </div>
                <button 
                  onClick={(e) => toggleFavorite(item, e)}
                  className="absolute top-4 right-4 text-2xl focus:outline-none hover:scale-110 transition"
                  aria-label="즐겨찾기 해제"
                >
                  ⭐
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 스마트폰 화면 최하단 고정 배너 */}
      <StickyBottomAd />

      {/* 학원 상세 모달창 (팝업) */}
      {selectedAcademy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-[#FFFDF9] w-full max-w-md h-[88vh] rounded-t-2xl p-6 overflow-y-auto relative pb-16 shadow-2xl border-t border-amber-100 flex flex-col">
            <button 
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 font-bold flex items-center justify-center transition z-10"
              onClick={() => setSelectedAcademy(null)}
            >
              ✕
            </button>
            
            <div className="mt-2 mb-2 flex flex-wrap gap-1.5">
              {selectedAcademy.subjects?.map((sub: string, sIdx: number) => {
                const colorClass = SUBJECT_STYLES[sub] || SUBJECT_STYLES['기본'];
                return (
                  <span
                    key={sIdx}
                    className={`text-xs font-bold px-2.5 py-0.5 rounded border ${colorClass}`}
                  >
                    {sub}
                  </span>
                );
              })}
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{selectedAcademy.name}</h2>
            <p className="text-xs text-gray-500 mb-4">{selectedAcademy.address}</p>
            
            <div className="mb-5">
              <a 
                href={`tel:${selectedAcademy.phone}`}
                className="flex items-center justify-center w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-3 rounded-xl text-sm font-bold transition"
              >
                📞 통화하기: {selectedAcademy.phone}
              </a>
            </div>
            
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-800 border-b border-amber-200 pb-2 mb-3">🕒 학년별 대략적인 예상 시간대</h3>
              <div className="flex flex-col gap-2">
                {selectedAcademy.timetable?.map((t: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-amber-100 p-3 rounded-lg text-xs">
                    <span className="font-bold text-gray-700 w-1/3">{t.target}</span>
                    <span className="text-gray-600 w-2/3 text-right">
                      {t.days ? `${t.days} | ` : ''}{t.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-800 border-b border-amber-200 pb-2 mb-3">💰 예상 수강료 범위</h3>
              <div className="flex flex-col gap-2">
                {selectedAcademy.pricing?.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-amber-50/80 border border-amber-200 p-3 rounded-lg text-xs">
                    <span className="font-bold text-gray-700 w-1/2">{p.grade}</span>
                    <span className="font-extrabold text-amber-800 w-1/2 text-right">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <a 
              href={selectedAcademy.place_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FAE100] text-[#371D1E] text-center font-bold py-3.5 rounded-xl mt-2 mb-2 shadow-sm hover:brightness-95 transition text-sm"
            >
              📍 카카오맵에서 상세 보기
            </a>

            <ModalAdBox />
          </div>
        </div>
      )}
    </div>
  );
}
