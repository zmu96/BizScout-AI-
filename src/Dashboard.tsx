import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  // 🔹 입력값
  const [company, setCompany] = useState('');

  // 🔹 n8n에서 받은 결과
  const [result, setResult] = useState<any>(null);

  // 🔹 검색 버튼 클릭
  const handleSearch = async () => {
    if (!company.trim()) return;

    try {
      const res = await fetch(
        '/webhook/c2a99030-dbf2-4a65-9f77-2bd5941c025c',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company }),
        }
      );

      const data = await res.json();
      console.log('받은 데이터:', data);
      setResult(data);
    } catch (error) {
      console.error('웹훅 호출 실패', error);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* 헤더 섹션 */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary mb-2">📊 BizScout</h1>
          <p className="text-muted">AI 기반 기업 데이터 및 시장 트렌드 분석 리포트</p>
        </div>

        {/* 검색창 섹션 */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control border-light-subtle"
                placeholder="분석할 기업명을 입력하세요 (예: 삼성전자)"
                style={{ backgroundColor: '#f8f9fa' }}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <button className="btn btn-primary px-4" onClick={handleSearch}>
                실시간 분석 실행
              </button>
            </div>
          </div>
        </div>

        {/* 결과 컨텐츠 틀 (데이터가 없으면 비어있는 틀만 유지) */}
        <div className="row g-4">
          {/* 좌측: 기본 정보 */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">🏢 기업 기본 정보</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">기업명</span>
                  <span className="fw-semibold">{result?.basicInfo?.companyName || result?.company || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">산업</span>
                  <span className="badge bg-info-subtle text-info fw-medium">
                    {result?.basicInfo?.industry || result?.industry || '-'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">본사</span>
                  <span className="fw-medium">{result?.basicInfo?.headquarters || result?.location || '-'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">설립일</span>
                  <span className="fw-medium">{result?.basicInfo?.founded || result?.founded || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 감정 분석 */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">💬 시장 감정 분석</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="mb-3">
                  <label className="small text-success fw-bold mb-2 d-block">POSITIVE</label>
                  <div className="d-flex flex-wrap gap-2">
                    {(result?.sentiment?.positive || result?.positive)?.map((k: string, i: number) => (
                      <span key={i} className="badge rounded-pill bg-success-subtle text-success px-3">#{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="small text-danger fw-bold mb-2 d-block">NEGATIVE</label>
                  <div className="d-flex flex-wrap gap-2">
                    {(result?.sentiment?.negative || result?.negative)?.map((k: string, i: number) => (
                      <span key={i} className="badge rounded-pill bg-danger-subtle text-danger px-3">#{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 뉴스 요약 */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">📰 최근 주요 뉴스 요약</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="p-3 rounded-3 border-start border-4 border-primary bg-light">
                  {result?.newsSummary || result?.news?.[0] || '분석 결과가 여기에 표시됩니다.'}
                </div>
              </div>
            </div>
          </div>

          {/* 인사이트 */}
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #f0f7ff)' }}>
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0 text-primary">🧠 전략 인사이트</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <ul className="list-group list-group-flush bg-transparent">
                  {result?.insight ? (
                    Array.isArray(result.insight) ? (
                      result.insight.map((item: string, i: number) => (
                        <li key={i} className="list-group-item bg-transparent border-0 px-0 py-1">💡 {item}</li>
                      ))
                    ) : (
                      <li className="list-group-item bg-transparent border-0 px-0 py-1">💡 {result.insight}</li>
                    )
                  ) : (
                    <li className="list-group-item bg-transparent border-0 px-0 py-1 text-muted">분석 데이터가 없습니다.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* 채용 정보 */}
          <div className="col-12 mb-5">
            <div className="card border-0 shadow-sm bg-dark text-white">
              <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">💼 실시간 채용 정보</h5>
                  <p className="mb-0 opacity-75">
                    {result?.jobs?.[0]?.title || "기업명을 검색하여 채용 정보를 확인하세요."}
                  </p>
                </div>
                <a 
                  href={result?.jobs?.[0]?.link || `https://www.saramin.co.kr/zf_user/search?searchword=${company || '기업'}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-light fw-bold px-4"
                >
                  공고 확인하기
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="text-center text-muted small pb-4">
          © 2024 BizScout Analysis Service. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;