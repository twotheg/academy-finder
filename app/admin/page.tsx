"use client";

import React, { useState } from 'react';

export default function AdminPage() {
  const [searchName, setSearchName] = useState('');
  const [academies, setAcademies] = useState<any[]>([]);
  const [selectedAcademy, setSelectedAcademy] = useState<any | null>(null);
  
  // 입력할 시간표 및 수강료 상태
  const [target, setTarget] = useState('중등부');
  const [days, setDays] = useState('월, 수, 금');
  const [time, setTime] = useState('18:00 - 20:00');
  
  const [grade, setGrade] = useState('중등부 정규반');
  const [price, setPrice] = useState('350,000원');

  const [message, setMessage] = useState('');

  // 1. 학원 이름으로 카카오 검색해서 ID 알아내기
  const handleSearchAcademy = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(searchName)}`);
    const data = await res.json();
    if (data.documents) {
      setAcademies(data.documents);
    }
  };

  // 2. 선택한 학원의 시간표/수강료를 Neon DB에 저장하기쿠
  const handleSaveData = async () => {
    if (!selectedAcademy) {
      alert('저장할 학원을 먼저 선택해주세요!');
      return;
    }

    const payload = {
      id: selectedAcademy.id,
      timetable: [{ target, days, time }],
      pricing: [{ grade, price }]
    };

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      setMessage(`"${selectedAcademy.name}" 학원 정보가 DB에 저장되었습니다!`);
    } else {
      setMessage('저장 실패');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-blue-600">🛠️ 학원 정보 관리자 페이지</h1>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="학원 이름 검색 (예: 대치동 영어학원)" 
          className="flex-1 border p-2 rounded text-sm"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearchAcademy} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">검색</button>
      </div>

      {/* 검색된 학원 리스트 */}
      <div className="flex flex-col gap-2 mb-6 max-h-48 overflow-y-auto border p-2 rounded">
        {academies.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedAcademy(item)}
            className={`p-2 rounded cursor-pointer text-sm ${selectedAcademy?.id === item.id ? 'bg-blue-100 font-bold' : 'bg-gray-50'}`}
          >
            {item.name} <span className="text-xs text-gray-500">({item.address})</span>
          </div>
        ))}
      </div>

      {selectedAcademy && (
        <div className="border-t pt-4">
          <h2 className="font-bold text-gray-800 mb-2">선택된 학원: {selectedAcademy.name}</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1">🕒 시간표 입력</h3>
            <input className="w-full border p-2 rounded text-sm mb-1" placeholder="대상 (예: 중등부)" value={target} onChange={(e) => setTarget(e.target.value)} />
            <input className="w-full border p-2 rounded text-sm mb-1" placeholder="요일 (예: 화, 목)" value={days} onChange={(e) => setDays(e.target.value)} />
            <input className="w-full border p-2 rounded text-sm mb-1" placeholder="시간 (예: 18:00 - 20:00)" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1">💰 수강료 입력</h3>
            <input className="w-full border p-2 rounded text-sm mb-1" placeholder="과정명 (예: 정규반)" value={grade} onChange={(e) => setGrade(e.target.value)} />
            <input className="w-full border p-2 rounded text-sm mb-1" placeholder="금액 (예: 350,000원)" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <button onClick={handleSaveData} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
            Neon DB에 저장하기
          </button>
          
          {message && <p className="text-center text-sm text-green-600 mt-2 font-semibold">{message}</p>}
        </div>
      )}
    </div>
  );
}
