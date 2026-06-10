import { useState, useEffect, useRef } from "react";

// Lottie JSON URL (LottieFiles Simple License — 상업적 이용 가능)
const LOTTIE_URLS = {
  default:     "https://assets9.lottiefiles.com/packages/lf20_ysas4vcp.json",
  pigeon:      "https://assets4.lottiefiles.com/packages/lf20_q5pk6p1k.json",
  foam_roller: "https://assets3.lottiefiles.com/packages/lf20_obhph3sh.json",
  shoulder:    "https://assets4.lottiefiles.com/packages/lf20_q5pk6p1k.json",
  calf:        "https://assets3.lottiefiles.com/packages/lf20_obhph3sh.json",
};

// ── 데이터 ──────────────────────────────────────
const SYMPTOMS = [
  { id: "knee_outer",      label: "무릎 바깥쪽" },
  { id: "knee_inner",      label: "무릎 안쪽" },
  { id: "knee_front",      label: "무릎 앞쪽 (슬개골)" },
  { id: "hip_side",        label: "골반 옆쪽" },
  { id: "hip_front",       label: "골반 앞쪽 (서혜부)" },
  { id: "hip_back",        label: "엉덩이 깊숙이" },
  { id: "lower_back",      label: "허리 (요추)" },
  { id: "lower_back_side", label: "허리 옆쪽 (한쪽)" },
  { id: "shoulder_front",  label: "어깨 앞쪽" },
  { id: "shoulder_top",    label: "어깨 위쪽·목 옆" },
  { id: "neck",            label: "목 (경추)" },
  { id: "calf",            label: "종아리" },
  { id: "shin",            label: "정강이 앞쪽" },
  { id: "achilles",        label: "발뒤꿈치·아킬레스" },
];

const TRIGGERS = [
  { id: "running",  label: "달리기·조깅" },
  { id: "jumping",  label: "점프·착지" },
  { id: "squat",    label: "스쿼트·앉았다 일어나기" },
  { id: "stairs",   label: "계단 오르내리기" },
  { id: "sitting",  label: "오래 앉아있다 일어날 때" },
  { id: "walking",  label: "걷기만 해도" },
  { id: "overhead", label: "팔 들어올릴 때" },
  { id: "pushing",  label: "밀기·당기기 동작" },
];

const POSTURE_HABITS = [
  { id: "leg_cross",      label: "다리 꼬고 앉기" },
  { id: "leg_up",         label: "한쪽 다리 올리고 앉기" },
  { id: "lean_side",      label: "한쪽으로 기대어 앉기" },
  { id: "one_leg",        label: "짝다리 짚기" },
  { id: "forward_head",   label: "거북목 자세" },
  { id: "pelvic_tilt",    label: "골반 앞으로 내밀기" },
  { id: "shoulder_hunch", label: "어깨 말림·라운드숄더" },
];

const PAIN_TYPE = [
  { id: "dull",    label: "뻐근·묵직함" },
  { id: "sharp",   label: "찌릿·날카로움" },
  { id: "burning", label: "화끈·저림" },
  { id: "stiff",   label: "뻣뻣함·가동범위 제한" },
];

const STRETCH_DATA = {
  "폼롤러 IT밴드 롤링": {
    duration: "60초", sets: "좌우 각 1세트", lottie: "foam_roller",
    youtube: "IT밴드 폼롤러 롤링 방법",
    steps: ["옆으로 누워 폼롤러를 무릎 위 허벅지 옆에 댄다", "반대쪽 발을 바닥에 짚어 체중을 조절", "천천히 골반까지 위아래로 굴린다 (압통점 10초 멈춤)"],
    caution: ["무릎 관절 위에 직접 올리지 말 것", "통증이 심하면 체중을 줄여서 시작"],
  },
  "비둘기 자세 (고관절 외회전 스트레칭)": {
    duration: "30~45초", sets: "좌우 각 3세트", lottie: "pigeon",
    youtube: "비둘기 자세 고관절 스트레칭",
    steps: ["한쪽 다리를 앞으로 접어 바닥에 놓는다", "뒷다리는 뒤로 길게 뻗는다", "상체를 천천히 앞으로 숙여 고관절 바깥이 당기는 느낌 유지"],
    caution: ["무릎 통증 시 발목을 몸 쪽으로 당길 것", "골반이 한쪽으로 기울지 않도록"],
  },
  "서서 IT밴드 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "IT밴드 서서 스트레칭",
    steps: ["한쪽 발을 반대쪽 발 뒤로 교차시켜 선다", "같은 쪽 팔을 머리 위로 올리며 반대 방향으로 몸을 기울인다", "허벅지 바깥쪽이 당기는 느낌 유지"],
    caution: ["균형 잡기 어려우면 벽에 손 짚고 할 것"],
  },
  "사이드 라잉 힙 어브덕션": {
    duration: "15회", sets: "3세트", lottie: "default",
    youtube: "사이드 라잉 힙 어브덕션 중둔근",
    steps: ["옆으로 눕고 아래쪽 무릎을 살짝 구부린다", "위쪽 다리를 일직선으로 유지하며 45도 올린다", "1초 멈췄다가 천천히 내린다 — 골반이 흔들리지 않도록"],
    caution: ["다리를 너무 높이 올리면 허리 부담", "발끝이 정면을 향하게"],
  },
  "클램쉘": {
    duration: "20회", sets: "3세트", lottie: "default",
    youtube: "클램쉘 운동 중둔근",
    steps: ["옆으로 눕고 무릎을 90도로 구부린다 (발뒤꿈치 붙임)", "발뒤꿈치를 붙인 채 위쪽 무릎만 위로 벌린다", "골반이 뒤로 넘어가지 않도록 복부에 힘"],
    caution: ["골반이 굴러가면 동작 범위 줄일 것"],
  },
  "밴드 워킹": {
    duration: "10보 왕복", sets: "3세트", lottie: "default",
    youtube: "밴드 사이드 워킹 중둔근",
    steps: ["밴드를 발목 위에 걸고 어깨너비보다 약간 넓게 선다", "무릎을 살짝 구부리고 옆으로 한 발씩 이동", "발을 너무 모으지 말고 밴드 장력 유지"],
    caution: ["상체가 흔들리지 않도록"],
  },
  "비둘기 자세": {
    duration: "45초", sets: "좌우 각 3세트", lottie: "pigeon",
    youtube: "비둘기 자세 이상근 스트레칭",
    steps: ["한쪽 다리를 앞으로 접어 바닥에 놓는다", "뒷다리는 뒤로 길게 뻗는다", "상체를 천천히 앞으로 숙여 엉덩이 깊숙이 당기는 느낌 유지"],
    caution: ["무릎 통증 시 발목 위치 조정", "골반 수평 유지"],
  },
  "누워서 figure-4 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "figure4 이상근 스트레칭",
    steps: ["등을 대고 누워 양 무릎을 세운다", "한쪽 발목을 반대쪽 허벅지 위에 올린다 (숫자 4 모양)", "두 손으로 아래쪽 허벅지를 감싸 가슴 쪽으로 당긴다"],
    caution: ["허리가 바닥에서 뜨지 않도록", "찌릿하면 강도 줄이기"],
  },
  "앉아서 이상근 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "앉아서 이상근 스트레칭",
    steps: ["의자에 앉아 한쪽 발목을 반대쪽 무릎 위에 올린다", "등을 펴고 상체를 천천히 앞으로 숙인다", "엉덩이 깊숙이 당기는 느낌이 나면 유지"],
    caution: ["허리를 구부리지 말고 엉덩이에서 접을 것"],
  },
  "누워서 무릎 가슴 당기기": {
    duration: "30초", sets: "좌우 각 3세트 + 양쪽 1세트", lottie: "default",
    youtube: "무릎 가슴 당기기 허리 스트레칭",
    steps: ["등을 대고 누워 한쪽 무릎을 두 손으로 감싼다", "무릎을 가슴 쪽으로 천천히 당긴다", "반대쪽 다리는 바닥에 편하게 뻗는다"],
    caution: ["허리 통증이 심해지면 즉시 중단", "호흡하며 천천히"],
  },
  "골반 교정 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "골반 교정 스트레칭 천장관절",
    steps: ["등을 대고 누워 한쪽 무릎을 반대편 바닥으로 내린다", "양 어깨는 바닥에서 떨어지지 않도록", "허리~골반 옆이 당기는 느낌을 30초 유지"],
    caution: ["어깨가 들리면 범위 제한", "날카로운 통증 시 중단"],
  },
  "캣카우": {
    duration: "10회 호흡", sets: "3세트", lottie: "default",
    youtube: "캣카우 척추 스트레칭",
    steps: ["네 발 자세 — 손목 어깨 아래, 무릎 골반 아래", "숨 들이쉬며 허리를 아래로 낮추고 고개를 든다 (카우)", "숨 내쉬며 등을 둥글게 말고 고개를 떨군다 (캣)"],
    caution: ["목을 과도하게 젖히지 말 것"],
  },
  "맥켄지 신전 운동 (가볍게)": {
    duration: "10회", sets: "2~3세트", lottie: "default",
    youtube: "맥켄지 신전 운동 허리",
    steps: ["엎드려 눕는다", "팔꿈치로 상체를 천천히 들어올린다 (스핑크스 자세)", "통증 없는 범위까지만"],
    caution: ["다리 저림 심해지면 즉시 중단 후 병원", "척추관 협착증이면 금지"],
  },
  "대퇴사두근 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "대퇴사두근 스트레칭",
    steps: ["한쪽 발을 뒤로 잡아 발뒤꿈치를 엉덩이 쪽으로 당긴다", "균형 어려우면 벽에 손 짚기", "허벅지 앞쪽이 당기는 느낌 유지"],
    caution: ["무릎을 억지로 꺾지 말 것"],
  },
  "햄스트링 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "햄스트링 스트레칭",
    steps: ["한쪽 발을 앞에 두고 발끝을 올린다", "등을 펴고 엉덩이부터 앞으로 숙인다", "허벅지 뒤쪽이 당기는 느낌 유지"],
    caution: ["허리를 구부리면 허리 부상 위험"],
  },
  "폼롤러 대퇴 롤링": {
    duration: "60초", sets: "좌우 각 1세트", lottie: "foam_roller",
    youtube: "폼롤러 허벅지 앞 롤링",
    steps: ["엎드려 허벅지 아래에 폼롤러를 댄다", "팔로 상체를 지지하며 천천히 위아래로 굴린다", "압통점에서 10초 멈추고 심호흡"],
    caution: ["무릎 관절 위에 직접 올리지 말 것"],
  },
  "목 옆면 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "shoulder",
    youtube: "목 옆면 사각근 스트레칭",
    steps: ["등을 펴고 앉아 한 손을 귀 위에 살짝 올린다", "천천히 반대편으로 목을 기울인다 (당기지 말고 무게만)", "목 옆면이 당기는 느낌을 30초 유지"],
    caution: ["절대 힘으로 당기지 말 것", "저림 오면 즉시 중단"],
  },
  "어깨 후면 스트레칭 (cross-body)": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "shoulder",
    youtube: "어깨 후면 크로스바디 스트레칭",
    steps: ["한쪽 팔을 가슴 앞으로 수평으로 뻗는다", "반대팔 팔꿈치로 그 팔을 몸 쪽으로 지그시 누른다", "어깨 뒤쪽이 당기는 느낌 유지"],
    caution: ["어깨를 으쓱하지 말고 내린 상태 유지"],
  },
  "흉추 가동성 운동 (폼롤러)": {
    duration: "10회", sets: "3세트", lottie: "foam_roller",
    youtube: "흉추 가동성 폼롤러",
    steps: ["폼롤러를 등 중간(견갑골 사이)에 가로로 댄다", "팔짱을 끼고 천천히 뒤로 누워 등이 펴지도록", "폼롤러 위치를 조금씩 위아래로 바꿔가며 반복"],
    caution: ["허리에 직접 대지 말 것", "목을 뒤로 꺾지 말기"],
  },
  "종아리 스트레칭 (벽 대고)": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "calf",
    youtube: "종아리 스트레칭 벽 대고",
    steps: ["벽에 손을 짚고 한 발을 뒤로 뻗는다", "뒷발 발뒤꿈치를 바닥에 누르며 무릎을 편다", "종아리 전체가 당기는 느낌을 30초 유지"],
    caution: ["발뒤꿈치가 뜨면 보폭을 줄일 것"],
  },
  "가자미근 스트레칭 (무릎 굽혀)": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "calf",
    youtube: "가자미근 스트레칭 아킬레스",
    steps: ["벽에 손을 짚고 한 발을 뒤로 반 보 뻗는다", "뒷발 무릎을 살짝 구부린 채 발뒤꿈치를 눌러 내린다", "발목 뒤쪽 깊숙이 당기는 느낌 유지"],
    caution: ["아킬레스 날카로운 통증 시 즉시 중단", "부종 있으면 병원 먼저"],
  },
  "정강이 스트레칭": {
    duration: "20초", sets: "좌우 각 3세트", lottie: "calf",
    youtube: "정강이 전경골근 스트레칭",
    steps: ["서서 한쪽 발등을 바닥에 대고 발끝이 뒤를 향하게 한다", "무릎을 살짝 구부리며 체중을 앞으로 옮긴다", "정강이 앞쪽이 당기는 느낌 유지"],
    caution: ["발목을 비틀지 말 것", "피로골절 의심 시 절대 금지"],
  },
  "런지 자세 장요근 스트레칭": {
    duration: "30초", sets: "좌우 각 3세트", lottie: "default",
    youtube: "장요근 런지 스트레칭",
    steps: ["한쪽 무릎을 바닥에 대고 런지 자세를 취한다", "골반을 앞으로 밀며 고관절 앞쪽이 당기도록", "상체는 세우고 허리를 과하게 젖히지 않는다"],
    caution: ["무릎이 발끝을 넘어가지 않도록"],
  },
};

const CAUSE_RULES = [
  { id:"itband", name:"IT밴드 증후군", desc:"장경인대가 대퇴골 외측 돌기와 마찰을 일으켜 염증 발생. 러너에게 가장 흔한 무릎 외측 통증.",
    match:(s,t,p)=>s.includes("knee_outer")&&(t.includes("running")||t.includes("stairs")),
    weight:(s,t,p)=>(s.includes("knee_outer")?3:0)+(t.includes("running")?2:0)+(s.includes("hip_side")?1:0)+((p.includes("leg_cross")||p.includes("one_leg"))?1:0),
    stretches:["폼롤러 IT밴드 롤링","비둘기 자세 (고관절 외회전 스트레칭)","서서 IT밴드 스트레칭"],
    avoid:["내리막 달리기","계단 반복","무릎 깊이 꺾는 스쿼트"], ok:["수영","상체 근력 운동","자전거 (안장 조정 후)"], red_flag:false },
  { id:"hip_weakness", name:"고관절 외전근 약화", desc:"중둔근·소둔근이 약해 골반이 달리기 중 한쪽으로 쏠림. 무릎·골반·허리 동시 통증의 가장 흔한 원인.",
    match:(s,t,p)=>s.includes("hip_side")&&(s.includes("knee_outer")||s.includes("lower_back_side")),
    weight:(s,t,p)=>(s.includes("hip_side")?2:0)+(s.includes("knee_outer")?2:0)+(s.includes("lower_back_side")?2:0)+(t.includes("running")?1:0)+((p.includes("leg_cross")||p.includes("one_leg"))?2:0),
    stretches:["사이드 라잉 힙 어브덕션","클램쉘","밴드 워킹"],
    avoid:["편측 부하 운동 무리하게","짝다리 습관"], ok:["클램쉘 강화","브릿지","사이드 플랭크"], red_flag:false },
  { id:"piriformis", name:"이상근 증후군", desc:"이상근이 좌골신경을 압박. 엉덩이 깊숙한 통증 + 저림이 특징. 다리 꼬기 습관과 강한 연관.",
    match:(s,t,p)=>s.includes("hip_back")&&(p.includes("leg_cross")||p.includes("leg_up")),
    weight:(s,t,p)=>(s.includes("hip_back")?3:0)+(p.includes("leg_cross")?2:0)+(p.includes("leg_up")?2:0)+(s.includes("lower_back_side")?1:0),
    stretches:["비둘기 자세","누워서 figure-4 스트레칭","앉아서 이상근 스트레칭"],
    avoid:["다리 꼬기","한쪽 다리 올리고 앉기","딥 스쿼트 (초기)"], ok:["수영 (자유형)","걷기","코어 안정화"], red_flag:false },
  { id:"si_joint", name:"천장관절 기능 이상", desc:"골반 뒤쪽 천장관절의 불균형. 한쪽 허리+골반 통증 패턴.",
    match:(s,t,p)=>s.includes("lower_back_side")&&s.includes("hip_side")&&(p.includes("lean_side")||p.includes("one_leg")||p.includes("leg_cross")),
    weight:(s,t,p)=>(s.includes("lower_back_side")?3:0)+(s.includes("hip_side")?2:0)+(p.includes("lean_side")?2:0)+(p.includes("one_leg")?1:0)+(p.includes("leg_cross")?1:0),
    stretches:["누워서 무릎 가슴 당기기","골반 교정 스트레칭","캣카우"],
    avoid:["한쪽으로만 짐 들기","짝다리","비대칭 운동 과부하"], ok:["좌우 균형 코어 운동","브릿지","걷기"], red_flag:false },
  { id:"disc", name:"요추 디스크 의심", desc:"허리 통증 + 다리 저림·방사통이 동반되면 디스크 가능성. 병원 확인 필요.",
    match:(s,t,p)=>s.includes("lower_back")&&(s.includes("knee_inner")||s.includes("hip_front")),
    weight:(s,t,p)=>(s.includes("lower_back")?3:0)+(s.includes("knee_inner")?2:0)+(s.includes("hip_front")?1:0),
    stretches:["맥켄지 신전 운동 (가볍게)"],
    avoid:["앞으로 숙이기","무거운 데드리프트","상체 비틀기"], ok:["걷기 (통증 없는 범위)","수영"],
    red_flag:true, red_flag_msg:"허리에서 다리로 뻗치는 저림·방사통 → 정형외과·신경외과 방문 필요." },
  { id:"pfss", name:"슬개대퇴 통증 증후군", desc:"슬개골이 제 궤도에서 벗어나 연골 마찰. 무릎 앞쪽 통증, 계단·스쿼트 시 심화.",
    match:(s,t,p)=>s.includes("knee_front")&&(t.includes("stairs")||t.includes("squat")),
    weight:(s,t,p)=>(s.includes("knee_front")?3:0)+(t.includes("stairs")?2:0)+(t.includes("squat")?2:0)+(t.includes("running")?1:0),
    stretches:["대퇴사두근 스트레칭","햄스트링 스트레칭","폼롤러 대퇴 롤링"],
    avoid:["계단 반복","깊은 스쿼트","무릎 꿇기"], ok:["수영","자전거 (안장 높게)","직선 다리 올리기"], red_flag:false },
  { id:"rounded_shoulder", name:"라운드숄더 / 어깨 충돌 증후군", desc:"어깨가 앞으로 말리며 회전근개와 견봉이 충돌. 팔을 들 때 어깨 앞·위쪽 통증.",
    match:(s,t,p)=>(s.includes("shoulder_front")||s.includes("shoulder_top"))&&(t.includes("overhead")||t.includes("pushing"))&&(p.includes("shoulder_hunch")||p.includes("forward_head")),
    weight:(s,t,p)=>(s.includes("shoulder_front")?3:0)+(s.includes("shoulder_top")?2:0)+(t.includes("overhead")?2:0)+(p.includes("shoulder_hunch")?2:0)+(p.includes("forward_head")?1:0),
    stretches:["어깨 후면 스트레칭 (cross-body)","흉추 가동성 운동 (폼롤러)"],
    avoid:["오버헤드 프레스 (통증 각도)","팔 뒤로 젖히기","무거운 벤치프레스"], ok:["밴드 페이스 풀","로우 계열 운동","흉추 가동성 운동"], red_flag:false },
  { id:"neck_tension", name:"경추 근긴장 / 거북목", desc:"목이 앞으로 나오면서 경추 주변 근육 과긴장. 목·어깨 뻐근함, 두통 동반 가능.",
    match:(s,t,p)=>(s.includes("neck")||s.includes("shoulder_top"))&&p.includes("forward_head"),
    weight:(s,t,p)=>(s.includes("neck")?3:0)+(s.includes("shoulder_top")?2:0)+(p.includes("forward_head")?3:0)+(p.includes("shoulder_hunch")?1:0),
    stretches:["목 옆면 스트레칭","흉추 가동성 운동 (폼롤러)"],
    avoid:["목 돌리기 서클","고개 뒤로 꺾기"], ok:["턱 당기기 (chin tuck)","벽 천사 운동","밴드 페이스 풀"], red_flag:false },
  { id:"achilles_tendon", name:"아킬레스건염", desc:"아킬레스건에 반복 과부하로 염증. 발뒤꿈치~종아리 아래 통증, 아침에 특히 심함.",
    match:(s,t,p)=>s.includes("achilles")&&(t.includes("running")||t.includes("jumping")),
    weight:(s,t,p)=>(s.includes("achilles")?4:0)+(t.includes("running")?2:0)+(t.includes("jumping")?2:0)+(s.includes("calf")?1:0),
    stretches:["종아리 스트레칭 (벽 대고)","가자미근 스트레칭 (무릎 굽혀)"],
    avoid:["달리기 (급성기)","점프","까치발 반복"], ok:["수영","자전거","편심성 힐 드롭"], red_flag:false },
  { id:"shin_splints", name:"정강이 통증 (Shin Splints)", desc:"전경골근·골막에 반복 충격으로 염증. 달리기 중 정강이 앞쪽 통증. 과훈련이 원인.",
    match:(s,t,p)=>s.includes("shin")&&t.includes("running"),
    weight:(s,t,p)=>(s.includes("shin")?4:0)+(t.includes("running")?3:0)+(t.includes("jumping")?1:0),
    stretches:["정강이 스트레칭","종아리 스트레칭 (벽 대고)"],
    avoid:["딱딱한 노면 달리기","갑작스러운 거리 증가","점프"], ok:["수영","자전거","걷기 (평지)"], red_flag:false },
  { id:"calf_strain", name:"종아리 근육 긴장", desc:"비복근·가자미근 과사용으로 긴장. 달리기·점프 후 종아리 뭉침.",
    match:(s,t,p)=>s.includes("calf")&&(t.includes("running")||t.includes("jumping")),
    weight:(s,t,p)=>(s.includes("calf")?3:0)+(t.includes("running")?2:0)+(t.includes("jumping")?2:0),
    stretches:["종아리 스트레칭 (벽 대고)","가자미근 스트레칭 (무릎 굽혀)"],
    avoid:["급격한 스프린트","점프 착지 반복","까치발 (급성기)"], ok:["수영","걷기","가벼운 자전거"], red_flag:false },
  { id:"hip_flexor", name:"장요근 긴장 / 고관절굴근 단축", desc:"오래 앉아있으면 장요근이 단축되어 고관절 앞쪽 당김·통증 유발.",
    match:(s,t,p)=>s.includes("hip_front")&&(t.includes("running")||t.includes("sitting"))&&(p.includes("pelvic_tilt")||p.includes("leg_cross")),
    weight:(s,t,p)=>(s.includes("hip_front")?3:0)+(t.includes("sitting")?2:0)+(t.includes("running")?1:0)+(p.includes("pelvic_tilt")?2:0)+(p.includes("leg_cross")?1:0),
    stretches:["런지 자세 장요근 스트레칭","누워서 무릎 가슴 당기기"],
    avoid:["레그레이즈 연속","오래 앉기"], ok:["브릿지","데드버그","걷기"], red_flag:false },
];

const RED_FLAGS_LIST = [
  { trigger:(s,t,p,pain)=>pain.includes("burning")&&s.includes("lower_back"), msg:"저림·화끈 + 허리 통증 → 신경 압박 가능성. 병원 확인 권장." },
  { trigger:(s,t,p,pain)=>t.includes("walking")&&s.includes("knee_inner"), msg:"걷기만 해도 무릎 안쪽 통증 → 반월판 손상 가능성. 정형외과 방문 필요." },
  { trigger:(s,t,p,pain)=>s.includes("hip_front")&&pain.includes("sharp"), msg:"서혜부 찌릿 통증 → FAI 또는 탈장 가능성. 영상검사 필요." },
  { trigger:(s,t,p,pain)=>s.includes("achilles")&&pain.includes("sharp"), msg:"아킬레스 찌릿 통증 → 건 파열 가능성. 즉시 운동 중단 후 병원." },
  { trigger:(s,t,p,pain)=>s.includes("shin")&&pain.includes("sharp"), msg:"정강이 날카로운 통증 → 피로골절 가능성. X-ray 확인 필요." },
];

function analyze(s,t,p,pain) {
  const matched = CAUSE_RULES.filter(r=>r.match(s,t,p)).map(r=>({...r,score:r.weight(s,t,p)})).sort((a,b)=>b.score-a.score).slice(0,3);
  const flags = RED_FLAGS_LIST.filter(f=>f.trigger(s,t,p,pain)).map(f=>f.msg);
  matched.forEach(m=>{ if(m.red_flag&&m.red_flag_msg&&!flags.includes(m.red_flag_msg)) flags.push(m.red_flag_msg); });
  return { causes: matched, flags };
}

// ── Lottie 컴포넌트 (lottie-web CDN 직접 로드) ──
function LottieAnim({ src }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    function loadLottie() {
      if (window.lottie) {
        if (animRef.current) animRef.current.destroy();
        if (!containerRef.current || cancelled) return;
        animRef.current = window.lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: src,
        });
        animRef.current.setSpeed(0.6);
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
        script.onload = () => { if (!cancelled) loadLottie(); };
        document.head.appendChild(script);
      }
    }

    loadLottie();
    return () => {
      cancelled = true;
      if (animRef.current) { animRef.current.destroy(); animRef.current = null; }
    };
  }, [src]);

  return (
    <div style={{ background: "#111", borderRadius: "12px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
      <div ref={containerRef} style={{ width: 150, height: 150 }} />
    </div>
  );
}

// ── UI 컴포넌트 ──
function MultiSelect({ options, selected, onChange, color = "#00C896" }) {
  const toggle = id => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
      {options.map(opt => {
        const on = selected.includes(opt.id);
        return (
          <button key={opt.id} onClick={() => toggle(opt.id)} style={{
            padding: "9px 15px", borderRadius: "100px",
            border: `2px solid ${on ? color : "#252525"}`,
            background: on ? `${color}20` : "#161616",
            color: on ? color : "#666", fontSize: "13px",
            cursor: "pointer", fontWeight: on ? 600 : 400, transition: "all 0.15s",
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

function StepBar({ current, labels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < labels.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%",
              background: i < current ? "#00C896" : i === current ? "#00C896" : "#1a1a1a",
              border: i === current ? "2px solid #00C896" : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700,
              color: i <= current ? "#0a0a0a" : "#2a2a2a",
              boxShadow: i === current ? "0 0 10px #00C89644" : "none",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: "10px", color: i === current ? "#00C896" : "#2a2a2a", whiteSpace: "nowrap" }}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ flex: 1, height: "2px", margin: "0 3px", marginBottom: "16px", background: i < current ? "#00C896" : "#1a1a1a" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function ScoreBar({ score }) {
  const pct = Math.min(score / 10, 1);
  const color = pct > 0.6 ? "#FF6B6B" : pct > 0.3 ? "#FFB347" : "#00C896";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "4px", background: "#1e1e1e", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: "10px", color, fontWeight: 700, minWidth: "24px" }}>{pct > 0.6 ? "높음" : pct > 0.3 ? "중간" : "낮음"}</span>
    </div>
  );
}

function StretchCard({ name }) {
  const [open, setOpen] = useState(false);
  const d = STRETCH_DATA[name];
  return (
    <div style={{ background: "#0c0c0c", border: "1px solid #1e1e1e", borderRadius: "11px", marginBottom: "8px", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "14px" }}>🧘</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#ddd" }}>{name}</div>
          {d && <div style={{ fontSize: "11px", color: "#00C896", marginTop: "2px" }}>{d.duration} · {d.sets}</div>}
        </div>
        <span style={{ color: "#333", fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && d && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #181818" }}>
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <LottieAnim src={LOTTIE_URLS[d.lottie]} />
          </div>
          <p style={{ fontSize: "10px", color: "#7B8FFF", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px" }}>동작 순서</p>
          {d.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "9px", marginBottom: "7px" }}>
              <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#7B8FFF22", color: "#7B8FFF", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              <p style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.6, margin: 0 }}>{step}</p>
            </div>
          ))}
          {d.caution.length > 0 && (
            <div style={{ background: "#FF6B2210", border: "1px solid #FF6B2230", borderRadius: "8px", padding: "8px 11px", margin: "10px 0" }}>
              <p style={{ fontSize: "10px", color: "#FF9060", fontWeight: 700, marginBottom: "4px" }}>⚠ 주의</p>
              {d.caution.map((c, i) => <p key={i} style={{ fontSize: "11px", color: "#FF9060", margin: "2px 0" }}>· {c}</p>)}
            </div>
          )}
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(d.youtube)}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 12px", background: "#FF000015", border: "1px solid #FF000030", borderRadius: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "13px" }}>▶</span>
            <span style={{ fontSize: "12px", color: "#FF6060", fontWeight: 600 }}>유튜브에서 동작 확인하기</span>
          </a>
        </div>
      )}
    </div>
  );
}

// ── 메인 ──
export default function PainTriage() {
  const [step, setStep] = useState(0);
  const [symptoms, setSymptoms] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [posture, setPosture] = useState([]);
  const [painType, setPainType] = useState([]);
  const [result, setResult] = useState(null);
  const [openCause, setOpenCause] = useState(null);
  const [side, setSide] = useState(null);

  const goNext = () => { if (step === 3) setResult(analyze(symptoms, triggers, posture, painType)); setStep(s => s + 1); };
  const canNext = () => { if (step === 0) return symptoms.length > 0; if (step === 1) return triggers.length > 0; if (step === 2) return true; if (step === 3) return painType.length > 0; return false; };
  const reset = () => { setStep(0); setSymptoms([]); setTriggers([]); setPosture([]); setPainType([]); setResult(null); setOpenCause(null); setSide(null); };

  const STEP_LABELS = ["증상 위치", "언제 아픔", "자세 습관", "통증 양상"];
  const AC = ["#00C896", "#7B8FFF", "#FFB347"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "640px", padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#00C896,#0099CC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⚡</div>
          <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.5px" }}>PainCheck</span>
          <span style={{ fontSize: "10px", color: "#2a2a2a", marginLeft: "auto" }}>Beta v2</span>
        </div>
        <p style={{ fontSize: "11px", color: "#383838", marginBottom: "22px" }}>증상 입력 → 원인 추정 → 스트레칭 가이드 · 의료 진단 대체 아님</p>
        {step < 4 && <StepBar current={step} labels={STEP_LABELS} />}
      </div>

      <div style={{ width: "100%", maxWidth: "640px", padding: "0 20px 80px" }}>

        {step === 0 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "5px" }}>어디가 아파?</h2>
            <p style={{ fontSize: "12px", color: "#4a4a4a", marginBottom: "18px" }}>복수 선택 가능</p>
            <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>아픈 쪽</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[["왼쪽","left"],["오른쪽","right"],["양쪽","both"]].map(([label,val]) => {
                const on = side === val;
                return <button key={val} onClick={() => setSide(val)} style={{ padding: "8px 15px", borderRadius: "100px", border: `2px solid ${on?"#00C896":"#252525"}`, background: on?"#00C89620":"#161616", color: on?"#00C896":"#555", fontSize: "13px", cursor: "pointer", fontWeight: on?600:400 }}>{label}</button>;
              })}
            </div>
            <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>통증 부위</p>
            <MultiSelect options={SYMPTOMS} selected={symptoms} onChange={setSymptoms} />
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "5px" }}>언제 아파?</h2>
            <p style={{ fontSize: "12px", color: "#4a4a4a", marginBottom: "18px" }}>해당하는 것 모두 선택</p>
            <MultiSelect options={TRIGGERS} selected={triggers} onChange={setTriggers} color="#7B8FFF" />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "5px" }}>평소 자세 습관</h2>
            <p style={{ fontSize: "12px", color: "#4a4a4a", marginBottom: "18px" }}>없으면 그냥 넘어가도 됨</p>
            <MultiSelect options={POSTURE_HABITS} selected={posture} onChange={setPosture} color="#FFB347" />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "5px" }}>어떻게 아파?</h2>
            <p style={{ fontSize: "12px", color: "#4a4a4a", marginBottom: "18px" }}>복수 선택 가능</p>
            <MultiSelect options={PAIN_TYPE} selected={painType} onChange={setPainType} color="#FF6B8A" />
          </div>
        )}

        {step === 4 && result && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>분석 결과</h2>
            <p style={{ fontSize: "11px", color: "#383838", marginBottom: "20px" }}>가능성 높은 순 · 확진 아님</p>

            {result.flags.length > 0 && (
              <div style={{ background: "#FF3B3010", border: "1px solid #FF3B3040", borderRadius: "12px", padding: "12px 15px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <span>🚨</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF6B6B" }}>병원 방문 권장</span>
                </div>
                {result.flags.map((f, i) => <p key={i} style={{ fontSize: "12px", color: "#FF9090", margin: "3px 0", lineHeight: 1.6 }}>• {f}</p>)}
              </div>
            )}

            {result.causes.length === 0 && (
              <div style={{ color: "#444", fontSize: "13px", textAlign: "center", padding: "40px" }}>
                매칭되는 원인이 없어요.<br />다른 증상 조합으로 시도하거나 병원을 방문하세요.
              </div>
            )}

            {result.causes.map((cause, idx) => {
              const isOpen = openCause === cause.id;
              const ac = AC[idx];
              return (
                <div key={cause.id} style={{ background: "#0f0f0f", border: `1px solid ${isOpen ? ac + "44" : "#1a1a1a"}`, borderRadius: "13px", marginBottom: "10px", overflow: "hidden", transition: "border-color 0.2s" }}>
                  <button onClick={() => setOpenCause(isOpen ? null : cause.id)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "11px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: `${ac}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: ac, flexShrink: 0 }}>{idx + 1}</div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", marginBottom: "5px" }}>{cause.name}</div>
                      <ScoreBar score={cause.score} />
                    </div>
                    <span style={{ color: "#2a2a2a", fontSize: "13px" }}>{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1px solid #161616" }}>
                      <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.7, margin: "12px 0" }}>{cause.desc}</p>
                      <p style={{ fontSize: "10px", color: "#00C896", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px" }}>✦ 추천 스트레칭</p>
                      {cause.stretches.map((s, i) => <StretchCard key={i} name={s} />)}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                        <div style={{ background: "#0a0a0a", borderRadius: "9px", padding: "10px" }}>
                          <p style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: 700, marginBottom: "5px" }}>✕ 피할 운동</p>
                          {cause.avoid.map((a, i) => <p key={i} style={{ fontSize: "11px", color: "#aaa", margin: "2px 0" }}>· {a}</p>)}
                        </div>
                        <div style={{ background: "#0a0a0a", borderRadius: "9px", padding: "10px" }}>
                          <p style={{ fontSize: "10px", color: "#7B8FFF", fontWeight: 700, marginBottom: "5px" }}>○ 해도 되는 운동</p>
                          {cause.ok.map((o, i) => <p key={i} style={{ fontSize: "11px", color: "#aaa", margin: "2px 0" }}>· {o}</p>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "#0c0c0c", borderRadius: "9px", padding: "10px 12px", marginTop: "14px" }}>
              <p style={{ fontSize: "10px", color: "#2a2a2a", lineHeight: 1.7, margin: 0 }}>ⓘ 의료 진단이 아닙니다. 통증 2주 이상 지속 또는 일상 활동이 어려우면 정형외과·스포츠의학과 방문을 권장합니다.</p>
            </div>
            <button onClick={reset} style={{ width: "100%", marginTop: "12px", padding: "13px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "11px", color: "#555", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>다시 체크하기</button>
          </div>
        )}

        {step < 4 && (
          <div style={{ marginTop: "30px" }}>
            <button onClick={goNext} disabled={!canNext()} style={{
              width: "100%", padding: "14px",
              background: canNext() ? "linear-gradient(135deg,#00C896,#0099CC)" : "#111",
              border: "none", borderRadius: "11px",
              color: canNext() ? "#0a0a0a" : "#252525",
              fontSize: "14px", fontWeight: 700,
              cursor: canNext() ? "pointer" : "not-allowed",
              boxShadow: canNext() ? "0 4px 18px #00C89628" : "none",
            }}>
              {step === 3 ? "결과 보기 →" : "다음 →"}
            </button>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ width: "100%", marginTop: "7px", padding: "9px", background: "none", border: "none", color: "#333", fontSize: "12px", cursor: "pointer" }}>
                ← 이전
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}