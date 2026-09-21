"use client";

import React, { useState, useEffect } from 'react';

const REGIONS: Record<string, Record<string, string[]>> = {
  "서울특별시": {
    "강남구": ["대치동", "도곡동", "개포동", "일원동", "역삼동", "삼성동", "청담동", "논현동"],
    "서초구": ["반포동", "서초동", "잠원동", "방배동", "양재동", "내곡동"],
    "송파구": ["잠실동", "방이동", "가락동", "문정동", "오금동", "송파동", "장지동"],
    "강동구": ["천호동", "성내동", "명일동", "고덕동", "암사동", "길동"],
    "마포구": ["공덕동", "상암동", "합정동", "서교동", "망원동", "성산동"],
    "용산구": ["이촌동", "한남동", "동부이촌동", "효창동", "청파동"],
    "성동구": ["성수동", "왕십리동", "행당동", "옥수동", "금호동"],
    "광진구": ["구의동", "자양동", "화양동", "능동", "중곡동"],
    "동대문구": ["회기동", "이문동", "전농동", "장안동", "답십리동"],
    "중랑구": ["면목동", "상봉동", "묵동", "신내동", "망우동"],
    "성북구": ["길음동", "정릉동", "돈암동", "삼선동", "종암동"],
    "강북구": ["수유동", "미아동", "번동", "우이동"],
    "도봉구": ["창동", "쌍문동", "방학동", "도봉동"],
    "노원구": ["상계동", "중계동", "하계동", "공릉동", "월계동"],
    "은평구": ["불광동", "연신내", "응암동", "구산동", "역촌동"],
    "서대문구": ["신촌동", "연희동", "홍제동", "북가좌동", "남가좌동"],
    "종로구": ["평창동", "혜화동", "이화동", "창신동", "무악동"],
    "중구": ["황학동", "신당동", "을지로동", "명동", "필동"],
    "영등포구": ["여의도동", "당산동", "문래동", "양평동", "신길동"],
    "구로구": ["구로동", "신도림동", "고척동", "개봉동", "오류동"],
    "금천구": ["가산동", "독산동", "시흥동"],
    "동작구": ["사당동", "노량진동", "상도동", "흑석동", "대방동"],
    "관악구": ["봉천동", "신림동", "남현동"],
    "양천구": ["목동", "신정동", "신월동"],
    "강서구": ["화곡동", "발산동", "등촌동", "방화동", "가양동"]
  },
  "부산광역시": {
    "해운대구": ["우동", "좌동", "중동", "재송동", "송정동", "반여동"],
    "수영구": ["남천동", "광안동", "민락동", "망미동"],
    "동래구": ["사직동", "명륜동", "온천동", "복천동"],
    "부산진구": ["부전동", "전포동", "양정동", "범천동"],
    "남구": ["대연동", "용호동", "문현동", "감만동"],
    "북구": ["화명동", "구포동", "만덕동"],
    "사하구": ["하단동", "당리동", "괴정동", "다대동"],
    "사상구": ["괘법동", "감전동", "덕포동"],
    "금정구": ["장전동", "구서동", "부곡동", "금사동"],
    "연제구": ["연산동", "거제동"],
    "동구": ["초량동", "수정동", "범일동"],
    "서구": ["동대신동", "서대신동", "충무동"],
    "중구": ["중앙동", "남포동", "부평동"],
    "영도구": ["봉래동", "청학동", "동삼동"],
    "강서구": ["명지동", "대저동", "가락동"],
    "기장군": ["기장읍", "정관읍", "일광면"]
  },
  "대구광역시": {
    "수성구": ["범어동", "만촌동", "황금동", "지산동", "범물동"],
    "달서구": ["상인동", "월성동", "이곡동", "본리동", "죽전동"],
    "중구": ["동인동", "삼덕동", "남산동"],
    "동구": ["신천동", "율하동", "각산동", "혁신동"],
    "서구": ["내당동", "평리동", "중리동"],
    "남구": ["대명동", "봉덕동"],
    "북구": ["칠성동", "산격동", "복현동", "태전동"],
    "달성군": ["화원읍", "논공읍", "다사읍", "유가읍"]
  },
  "인천광역시": {
    "연수구": ["송도동", "연수동", "동춘동", "청학동"],
    "남동구": ["구월동", "간석동", "만수동", "논현동"],
    "부평구": ["부평동", "산곡동", "십정동", "삼산동"],
    "미추홀구": ["주안동", "도화동", "숭의동", "학익동"],
    "계양구": ["계산동", "작전동", "효성동"],
    "서구": ["검단동", "석남동", "가정동", "청라동"],
    "중구": ["신포동", "운서동", "영종동"],
    "동구": ["송림동", "화수동", "만석동"],
    "강화군": ["강화읍", "길상면"],
    "옹진군": ["백령면", "연평면"]
  },
  "광주광역시": {
    "남구": ["봉선동", "진월동", "주월동"],
    "광산구": ["수완동", "신창동", "월계동", "첨단동"],
    "서구": ["치평동", "화정동", "쌍촌동"],
    "북구": ["운암동", "용봉동", "문흥동", "임동"],
    "동구": ["학동", "산수동", "계림동"]
  },
  "대전광역시": {
    "서구": ["둔산동", "월평동", "탄방동", "관저동"],
    "유성구": ["관평동", "지족동", "반석동", "봉명동", "구성동"],
    "중구": ["은행동", "문화동", "대흥동"],
    "동구": ["가양동", "용운동", "판암동"],
    "대덕구": ["법동", "송촌동", "중리동"]
  },
  "울산광역시": {
    "남구": ["옥동", "신정동", "삼산동", "달동"],
    "중구": ["성남동", "우정동", "복산동"],
    "동구": ["전하동", "화정동", "방어동"],
    "북구": ["농소동", "효문동", "화봉동"],
    "울주군": ["범서읍", "언양읍", "온양읍"]
  },
  "세종특별자치시": {
    "세종시": ["새롬동", "아름동", "보람동", "도담동", "다정동", "종촌동", "고운동", "한솔동"]
  },
  "경기도": {
    "성남시 분당구": ["정자동", "수내동", "서현동", "야탑동", "이매동"],
    "성남시 수정구": ["신흥동", "태평동", "위례동"],
    "성남시 중원구": ["성남동", "중앙동", "금광동"],
    "수원시 영통구": ["영통동", "이의동", "매탄동", "망포동"],
    "수원시 팔달구": ["인계동", "지동", "우만동"],
    "수원시 장안구": ["정자동", "율전동", "천천동"],
    "수원시 권선구": ["권선동", "세류동", "호매실동"],
    "고양시 일산동구": ["백석동", "마두동", "장항동", "식사동"],
    "고양시 일산서구": ["주엽동", "탄현동", "대화동"],
    "고양시 덕양구": ["화정동", "행신동", "삼송동"],
    "용인시 수지구": ["죽전동", "풍덕천동", "동천동"],
    "용인시 기흥구": ["구갈동", "보라동", "신갈동"],
    "용인시 처인구": ["김량장동", "포곡읍"],
    "화성시": ["동탄동", "병점동", "봉담읍", "향남읍"],
    "부천시": ["중동", "상동", "심곡동", "송내동"],
    "안양시 동안구": ["평촌동", "관양동", "비산동"],
    "안양시 만안구": ["안양동", "석수동"],
    "안산시 단원구": ["고잔동", "선부동", "원곡동"],
    "안산시 상록구": ["본오동", "사동", "이동"],
    "남양주시": ["다산동", "별내동", "평내동", "화도읍"],
    "평택시": ["비전동", "송탄동", "안중읍", "고덕동"],
    "시흥시": ["정왕동", "은행동", "배곧동"],
    "파주시": ["금촌동", "운정동", "문산읍"],
    "김포시": ["장기동", "구래동", "사우동"],
    "의정부시": ["신곡동", "가능동", "민락동"],
    "광명시": ["철산동", "하안동", "소하동"],
    "군포시": ["산본동", "당동"],
    "광주시": ["오포읍", "경안동", "송정동"],
    "이천시": ["창전동", "증포동"],
    "양주시": ["옥정동", "회천동"],
    "오산시": ["오산동", "세마동"],
    "구리시": ["인창동", "수택동"],
    "안성시": ["봉산동", "공도읍"],
    "포천시": ["신읍동", "소흘읍"],
    "의왕시": ["내손동", "오전동"],
    "하남시": ["미사동", "덕풍동", "위례동"],
    "여주시": ["여흥동", "가남읍"],
    "동두천시": ["생연동", "지행동"],
    "과천시": ["별양동", "부림동"],
    "가평군": ["가평읍"],
    "양평군": ["양평읍"],
    "연천군": ["연천읍"]
  },
  "강원특별자치도": {
    "춘천시": ["퇴계동", "석사동", "요선동", "온의동"],
    "원주시": ["무실동", "단구동", "단계동", "우산동"],
    "강릉시": ["교동", "포남동", "옥천동", "입암동"],
    "동해시": ["천곡동", "발한동"],
    "속초시": ["교동", "청호동"],
    "삼척시": ["교동", "성내동"],
    "홍천군": ["홍천읍"],
    "횡성군": ["횡성읍"],
    "영월군": ["영월읍"],
    "평창군": ["평창읍", "대관령면"],
    "정선군": ["정선읍"],
    "철원군": ["철원읍", "동송읍"],
    "화천군": ["화천읍"],
    "양구군": ["양구읍"],
    "인제군": ["인제읍"],
    "고성군": ["간성읍", "거진읍"],
    "양양군": ["양양읍"]
  },
  "충청북도": {
    "청주시 흥덕구": ["복대동", "봉명동", "가경동"],
    "청주시 청원구": ["오창읍", "내수읍"],
    "청주시 상당구": ["용암동", "금천동"],
    "청주시 서원구": ["산남동", "분평동"],
    "충주시": ["연수동", "호암동", "칠금동"],
    "제천시": ["화산동", "청전동"],
    "음성군": ["음성읍", "금왕읍"],
    "진천군": ["진천읍", "덕산읍"],
    "괴산군": ["괴산읍"],
    "단양군": ["단양읍"],
    "보은군": ["보은읍"],
    "옥천군": ["옥천읍"],
    "영동군": ["영동읍"],
    "증평군": ["증평읍"]
  },
  "충청남도": {
    "천안시 서북구": ["불당동", "쌍용동", "성정동"],
    "천안시 동남구": ["신부동", "청수동", "목천읍"],
    "아산시": ["온천동", "배방읍", "탕정면"],
    "서산시": ["동문동", "성연면"],
    "공주시": ["산성동", "웅진동"],
    "보령시": ["대천동", "명천동"],
    "논산시": ["강경읍", "부적면"],
    "당진시": ["당진읍", "송악읍"],
    "계룡시": ["엄사면", "두마면"],
    "금산군": ["금산읍"],
    "부여군": ["부여읍"],
    "서천군": ["장항읍", "서천읍"],
    "청양군": ["청양읍"],
    "홍성군": ["홍성읍"],
    "예산군": ["예산읍"],
    "태안군": ["태안읍", "안면읍"]
  },
  "전북특별자치도": {
    "전주시 완산구": ["효자동", "서신동", "삼천동"],
    "전주시 덕진구": ["송천동", "덕진동", "인후동"],
    "군산시": ["나운동", "수송동", "미룡동"],
    "익산시": ["모현동", "영등동", "부송동"],
    "정읍시": ["연지동", "장명동"],
    "남원시": ["도통동", "금동"],
    "김제시": ["요촌동", "신풍동"],
    "완주군": ["삼례읍", "봉동읍"],
    "진안군": ["진안읍"],
    "무주군": ["무주읍"],
    "장수군": ["장수읍"],
    "임실군": ["임실읍"],
    "순창군": ["순창읍"],
    "고창군": ["고창읍"],
    "부안군": ["부안읍"]
  },
  "전라남도": {
    "순천시": ["연향동", "왕조동", "조례동", "풍덕동"],
    "목포시": ["옥암동", "상동", "연산동"],
    "여수시": ["학동", "문수동", "신월동"],
    "광양시": ["중마동", "광양읍"],
    "나주시": ["빛가람동", "송월동"],
    "담양군": ["담양읍"],
    "곡성군": ["곡성읍"],
    "구례군": ["구례읍"],
    "고흥군": ["고흥읍"],
    "보성군": ["보성읍"],
    "화순군": ["화순읍"],
    "장흥군": ["장흥읍"],
    "강진군": ["강진읍"],
    "해남군": ["해남읍"],
    "영암군": ["영암읍"],
    "무안군": ["무안읍", "삼향읍"],
    "함평군": ["함평읍"],
    "영광군": ["영광읍"],
    "장성군": ["장성읍"],
    "완도군": ["완도읍"],
    "진도군": ["진도읍"],
    "신안군": ["압해읍"]
  },
  "경상북도": {
    "포항시 남구": ["효자동", "이동", "대잠동"],
    "포항시 북구": ["장성동", "죽도동", "양덕동"],
    "구미시": ["형곡동", "인의동", "송정동"],
    "경주시": ["황성동", "성건동", "용강동"],
    "안동시": ["옥동", "송현동"],
    "경산시": ["중앙동", "사동", "옥산동"],
    "김천시": ["평화동", "율곡동"],
    "영주시": ["영주동", "휴천동"],
    "영천시": ["완산동", "야사동"],
    "상주시": ["복룡동", "무양동"],
    "문경시": ["점촌동", "모전동"],
    "칠곡군": ["왜관읍", "석적읍"],
    "군위군": ["군위읍"],
    "의성군": ["의성읍"],
    "청송군": ["청송읍"],
    "영양군": ["영양읍"],
    "영덕군": ["영덕읍"],
    "청도군": ["청도읍"],
    "고령군": ["대가야읍"],
    "성주군": ["성주읍"],
    "예천군": ["예천읍"],
    "봉화군": ["봉화읍"],
    "울진군": ["울진읍"],
    "울릉군": ["울릉읍"]
  },
  "경상남도": {
    "창원시 성산구": ["상남동", "중앙동", "가음정동"],
    "창원시 의창구": ["팔용동", "명서동", "봉림동"],
    "창원시 마산합포구": ["신월동", "월영동"],
    "창원시 마산회원구": ["회원동", "양덕동"],
    "창원시 진해구": ["석동", "이동"],
    "진주시": ["평거동", "칠암동", "가좌동"],
    "김해시": ["삼계동", "장유동", "내외동"],
    "양산시": ["물금읍", "중앙동"],
    "거제시": ["고현동", "장승포동"],
    "통영시": ["도천동", "무전동"],
    "사천시": ["동동", "벌리동"],
    "밀양시": ["내이동", "삼문동"],
    "함안군": ["가야읍"],
    "창녕군": ["창녕읍"],
    "고성군": ["고성읍"],
    "남해군": ["남해읍"],
    "하동군": ["하동읍"],
    "산청군": ["산청읍"],
    "함양군": ["함양읍"],
    "거창군": ["거창읍"],
    "합천군": ["합천읍"]
  },
  "제주특별자치도": {
    "제주시": ["노형동", "연동", "이도동", "화북동", "삼양동", "애월읍"],
    "서귀포시": ["동홍동", "중문동", "서홍동", "대정읍", "성산읍"]
  }
};
const CATEGORIES = ['국어', '영어', '수학', '과학', '피아노', '미술', '태권도', '유도', '주짓수', '검도'];

export default function AcademyFinder() {
  const [city, setCity] = useState('서울특별시');
  const [district, setDistrict] = useState('강남구');
  const [neighborhood, setNeighborhood] = useState('대치동');
  const [category, setCategory] = useState('전체');
  const [directKeyword, setDirectKeyword] = useState(''); // 직접 검색어 상태
  
  const [results, setResults] = useState<any[]>([]);
  const [selectedAcademy, setSelectedAcademy] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  useEffect(() => {
    const saved = localStorage.getItem('academy_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('academy_favorites', JSON.stringify(updated));
  };

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

  // 통합 검색 함수 (직접 검색어가 있으면 그것우선, 없으면 지역/카테고리 조합으로 검색)
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
      <div className="flex bg-white border-b">
        <button 
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 학원 검색
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'favorites' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('favorites')}
        >
          ⭐ 관심 학원 ({favorites.length})
        </button>
      </div>

      {activeTab === 'search' ? (
        <>
          <div className="bg-white p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800 mb-4">우리동네 학원 찾기</h1>
            
            {/* 직접 검색 입력창 */}
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="학원 이름을 직접 입력하세요 (예: 한양수학학원)" 
                className="flex-1 border rounded p-2 text-sm"
                value={directKeyword}
                onChange={(e) => setDirectKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

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
                {isLoading ? '검색 중...' : '학원 검색하기'}
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {results.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow p-3 flex gap-4 cursor-pointer hover:shadow-md transition relative"
                  onClick={() => setSelectedAcademy(item)}
                >
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex flex-col justify-center w-full overflow-hidden pr-6">
                    <span className="text-xs font-semibold text-blue-600 mb-1">{item.type}</span>
                    <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.address}</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">📞 {item.phone}</p>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-3 right-3 text-2xl focus:outline-none"
                  >
                    {isFav ? '⭐' : '☆'}
                  </button>
                </div>
              );
            })}
            {results.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 mt-10">
                원하시는 학원을 검색해 보세요.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-lg mb-2">⭐ 내가 찜한 관심 학원</h2>
          {favorites.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              아직 찜한 학원이 없습니다.
            </div>
          )}
        </div>
      )}

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
            <p className="text-sm text-gray-500 mb-2">{selectedAcademy.address}</p>
            
            <div className="mb-4">
              <a 
                href={`tel:${selectedAcademy.phone}`}
                className="inline-block bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-semibold"
              >
                📞 전화 통화하기: {selectedAcademy.phone}
              </a>
            </div>
            
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
              <div className="flex flex-col grade-box flex flex-col gap-2">
                {selectedAcademy.pricing.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between bg-blue-50 p-3 rounded text-sm">
                    <span className="font-semibold text-gray-700">{p.grade}</span>
                    <span className="font-bold text-blue-700">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
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
