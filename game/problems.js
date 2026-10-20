// =============================================================
//  소수의 나눗셈 문제 자동 생성 (6학년 2학기)
//  서버에서만 실행 → 정답은 학생 화면에 가지 않음
//
//  출제 범위: 몫이 소수 첫째 자리 이내로 딱 떨어지는 문제만 나옵니다.
//  (반올림해야 하는 문제, 나머지를 구하는 문제는 넣지 않았어요.)
//  모든 계산은 정수로 해서 소수 계산 오차가 생기지 않아요.
// =============================================================
const rnd = n => Math.floor(Math.random() * n);
const between = (a, b) => a + rnd(b - a + 1);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const P10 = k => Math.pow(10, k);
const pick = arr => arr[rnd(arr.length)];

// 정수 v를 10^sc로 나눈 값을 문자열로 (소수점 아래 끝의 0은 지움) 예) dec(168,2)='1.68', dec(360,2)='3.6'
function dec(v, sc) {
  let s = String(Math.abs(v));
  if (sc > 0) {
    s = s.padStart(sc + 1, '0');
    const ip = s.slice(0, s.length - sc), fp = s.slice(s.length - sc).replace(/0+$/, '');
    s = fp ? ip + '.' + fp : ip;
  }
  return (v < 0 ? '-' : '') + s;
}
// 문자열 소수 → {int, sc}  예) '1.68' → {int:168, sc:2}
function parse(s) { const [i, f = ''] = String(s).split('.'); return { int: Number(i + f), sc: f.length }; }
// 소수 문자열에 10^e를 곱한 문자열
function times10(s, e) { const p = parse(s); return p.sc - e >= 0 ? dec(p.int, p.sc - e) : String(p.int * P10(e - p.sc)); }
const decimals = s => parse(s).sc;

// ---------- 정확히 나누어떨어지는 (소수)÷(소수) 만들기 ----------
// 나누는 수 b/10^qd, 몫 k/10^r 을 먼저 정하고, 나누어지는 수 = 나누는 수 × 몫
function genExact(opt = {}) {
  for (;;) {
    const qd = opt.qd || (Math.random() < 0.6 ? 1 : 2);        // 나누는 수의 소수 자릿수
    const r = opt.r !== undefined ? opt.r : (Math.random() < 0.5 ? 0 : 1); // 몫의 소수 자릿수 (0: 자연수, 1: 소수 첫째 자리)
    if (qd + r > 2) continue;                                   // 나누어지는 수는 소수 둘째 자리까지
    const b = qd === 1 ? between(opt.bMin || 2, 49) : between(3, 49);
    if (b % 10 === 0) continue;
    let k;
    if (r === 1) { k = between(11, 99); if (k % 10 === 0) continue; }
    else if (qd === 2 && Math.random() < 0.5) k = 10 * between(1, 6);   // 3.6 ÷ 0.12 = 30 처럼 자릿수가 다른 경우
    else k = between(2, 30);
    if (opt.maxQ && k / P10(r) > opt.maxQ) continue;
    const aInt = b * k, aSc = qd + r;
    if (aInt / P10(aSc) > 60) continue;
    return { D: dec(aInt, aSc), V: dec(b, qd), Q: dec(k, r) };
  }
}
// (자연수)÷(소수) — 몫이 소수 첫째 자리 이내로 떨어지는 경우만
function genNatural(opt = {}) {
  for (let t = 0; t < 2000; t++) {
    const qd = opt.qd || (Math.random() < 0.65 ? 1 : 2);
    const b = qd === 1 ? between(opt.bMin || 2, 49) : between(4, 49);
    if (b % 10 === 0) continue;
    const N = between(2, 60);
    const rs = opt.r === 0 ? [0] : Math.random() < 0.75 ? [0, 1] : [1, 0];
    for (const r of rs) {
      const numr = N * P10(qd + r);
      if (numr % b !== 0) continue;
      const k = numr / b;
      if (k < 2 || k / P10(r) > (opt.maxQ || 300) || (r === 1 && k % 10 === 0)) continue;
      return { D: String(N), V: dec(b, qd), Q: dec(k, r) };
    }
  }
  return { D: '12', V: '0.4', Q: '30' };
}

// ---------- 그림(SVG) ----------
const FONT = "Jua,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const GOLD = '#F2B84B', LIGHT = '#FBE3A6', BLUE = '#7fb3ff', DARK = '#3b2a0b';
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let svgSeq = 0;
const unk = t => (t === '?' ? BLUE : LIGHT);

// 세로셈 모양: 나누는 수 ) 나누어지는 수, 위에 몫
function longDivSVG(V, D, Q) {
  const fs = 46, cw = 27;
  const x0 = 26 + V.length * cw + 22;
  const dw = Math.max(D.length, Q.length) * cw + 34;
  const W = x0 + dw + 24, H = 150;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}" font-weight="700">
<text x="${x0 - 16}" y="106" font-size="${fs}" text-anchor="end" fill="${V === '?' ? BLUE : GOLD}">${xml(V)}</text>
<path d="M${x0} 62 H${x0 + dw} M${x0} 62 Q${x0 + 16} 92 ${x0} 122" fill="none" stroke="${LIGHT}" stroke-width="3.5" stroke-linecap="round"/>
<text x="${x0 + 16}" y="106" font-size="${fs}" fill="${unk(D)}">${xml(D)}</text>
<text x="${x0 + 16}" y="50" font-size="${fs}" fill="${unk(Q)}">${xml(Q)}</text></svg>`;
}
// 두 수에 같은 수를 곱해서 옮기는 그림
function shiftSVG(top, bottom, mult) {
  const mid = 'ah' + (++svgSeq);
  const cell = (t, x, y) => {
    const fs = Math.min(42, Math.floor(130 / Math.max(2, t.length * 0.62)));
    if (t === '?') return `<rect x="${x - 34}" y="${y - 38}" width="68" height="54" rx="6" fill="none" stroke="${BLUE}" stroke-width="3" stroke-dasharray="6 5"/><text x="${x}" y="${y}" font-size="38" text-anchor="middle" fill="${BLUE}">?</text>`;
    return `<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" fill="${LIGHT}">${xml(t)}</text>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 230" width="360" height="230" font-family="${FONT}" font-weight="700">
<defs><marker id="${mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${BLUE}"/></marker></defs>
${cell(top[0], 85, 62)}<text x="180" y="62" font-size="40" text-anchor="middle" fill="${GOLD}">÷</text>${cell(top[1], 275, 62)}
<line x1="85" y1="82" x2="85" y2="142" stroke="${BLUE}" stroke-width="3" marker-end="url(#${mid})"/>
<line x1="275" y1="82" x2="275" y2="142" stroke="${BLUE}" stroke-width="3" marker-end="url(#${mid})"/>
<text x="97" y="120" font-size="24" fill="${BLUE}">×${mult}</text><text x="287" y="120" font-size="24" fill="${BLUE}">×${mult}</text>
${cell(bottom[0], 85, 208)}<text x="180" y="208" font-size="40" text-anchor="middle" fill="${GOLD}">÷</text>${cell(bottom[1], 275, 208)}</svg>`;
}
// 알고 있는 나눗셈을 이용하는 그림
function pointSVG(known, ask) {
  const mid = 'ah' + (++svgSeq);
  const fit = t => Math.min(44, Math.floor(330 / (t.length * 0.6)));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="360" height="220" font-family="${FONT}" font-weight="700">
<defs><marker id="${mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${BLUE}"/></marker></defs>
<text x="180" y="62" font-size="${fit(known)}" text-anchor="middle" fill="${GOLD}">${xml(known)}</text>
<line x1="180" y1="82" x2="180" y2="132" stroke="${BLUE}" stroke-width="3" marker-end="url(#${mid})"/>
<text x="196" y="114" font-size="22" fill="${BLUE}">소수점 위치는?</text>
<text x="180" y="196" font-size="${fit(ask)}" text-anchor="middle" fill="${LIGHT}">${xml(ask)}</text></svg>`;
}
// 문장제: 전체를 같은 양씩 나누는 막대 그림
function wordSVG(total, step, unit, note) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190" width="360" height="190" font-family="${FONT}" font-weight="700">
<text x="180" y="32" font-size="26" text-anchor="middle" fill="${LIGHT}">전체 ${xml(total)}${xml(unit)}</text>
<path d="M30 48 V56 H330 V48" fill="none" stroke="${LIGHT}" stroke-width="3" stroke-linejoin="round"/>
<rect x="30" y="68" width="300" height="56" rx="6" fill="none" stroke="${LIGHT}" stroke-width="2.5" stroke-dasharray="7 6"/>
<rect x="30" y="68" width="68" height="56" fill="${GOLD}" stroke="#5a3d10" stroke-width="2"/>
<rect x="98" y="68" width="68" height="56" fill="#D18F2C" stroke="#5a3d10" stroke-width="2"/>
<text x="64" y="104" font-size="20" text-anchor="middle" fill="${DARK}">${xml(step)}</text>
<text x="132" y="104" font-size="20" text-anchor="middle" fill="${DARK}">${xml(step)}</text>
<text x="248" y="106" font-size="34" text-anchor="middle" fill="${LIGHT}">···</text>
<text x="180" y="162" font-size="22" text-anchor="middle" fill="${BLUE}">${xml(note)}</text></svg>`;
}
// 몫 비교: 양팔저울 그림
function scaleSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="360" height="220" font-family="${FONT}" font-weight="700">
<g fill="none" stroke="${LIGHT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
<path d="M180 56 V176 M130 182 H230"/><path d="M56 66 H304"/>
<path d="M56 66 L30 128 M56 66 L82 128 M30 128 H82 M304 66 L278 128 M304 66 L330 128 M278 128 H330" stroke-width="3"/></g>
<circle cx="180" cy="52" r="9" fill="${GOLD}"/>
<text x="56" y="120" font-size="22" text-anchor="middle" fill="${GOLD}">몫</text><text x="304" y="120" font-size="22" text-anchor="middle" fill="${GOLD}">몫</text>
<text x="180" y="212" font-size="20" text-anchor="middle" fill="${BLUE}">몫의 크기를 비교해요</text></svg>`;
}

// ---------- 문제 유형 ----------
const TYPES = ['calc', 'natural', 'shift', 'word', 'point', 'inverse', 'compare'];
const TYPE_LABEL = { calc: '소수 ÷ 소수', natural: '자연수 ÷ 소수', shift: '소수점 옮겨 계산', word: '문장 문제',
  point: '몫의 소수점 위치', inverse: '□ 구하기', compare: '몫의 크기 비교' };
const b = s => `<b>${s}</b>`;

const WORD_COUNT = [   // 몇 개로 나누어지는지 (몫이 자연수)
  (D, V) => ({ text: `주스 ${b(D + ' L')}를 한 컵에 ${b(V + ' L')}씩 나누어 담으면 몇 컵이 되나요?`, unit: '컵', step: V, u: 'L', note: `${V} L씩 나누면 몇 컵?` }),
  (D, V) => ({ text: `리본 ${b(D + ' m')}를 ${b(V + ' m')}씩 자르면 몇 도막이 되나요?`, unit: '도막', step: V, u: 'm', note: `${V} m씩 자르면 몇 도막?` }),
  (D, V) => ({ text: `쌀 ${b(D + ' kg')}을 한 봉지에 ${b(V + ' kg')}씩 담으면 몇 봉지가 되나요?`, unit: '봉지', step: V, u: 'kg', note: `${V} kg씩 담으면 몇 봉지?` }),
  (D, V) => ({ text: `물 ${b(D + ' L')}를 ${b(V + ' L')}짜리 물통에 가득 채워 나누어 담으면 물통은 몇 개 필요한가요?`, unit: '개', step: V, u: 'L', note: `${V} L 물통에 나누면 몇 개?` }),
];
const WORD_AMOUNT = [  // 몫이 소수여도 되는 문장제
  (D, V) => ({ text: `민수가 한 시간에 ${b(V + ' km')}씩 일정한 빠르기로 걷습니다. ${b(D + ' km')}를 가려면 몇 시간이 걸리나요?`, unit: '시간', step: V, u: 'km', note: `1시간에 ${V} km씩 가면?` }),
  (D, V) => ({ text: `달팽이가 1분에 ${b(V + ' m')}씩 갑니다. ${b(D + ' m')}를 가려면 몇 분이 걸리나요?`, unit: '분', step: V, u: 'm', note: `1분에 ${V} m씩 가면?` }),
  (D, V) => ({ text: `벽 1 m²를 칠하는 데 페인트 ${b(V + ' L')}가 필요합니다. 페인트 ${b(D + ' L')}로는 몇 m²를 칠할 수 있나요?`, unit: 'm²', step: V, u: 'L', note: `1 m²에 ${V} L씩 쓰면?` }),
];

function makeProblem(type) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (type === 'calc') {
      const g = genExact();
      return { type, text: `계산해 보세요. ${b(g.D + ' ÷ ' + g.V + ' = ?')}`, figs: [{ svg: longDivSVG(g.V, g.D, '?'), cap: '세로셈' }], answer: Number(g.Q), unit: '', meta: g };
    }
    if (type === 'natural') {
      const g = genNatural();
      return { type, text: `자연수를 소수로 나누어 보세요. ${b(g.D + ' ÷ ' + g.V + ' = ?')}`, figs: [{ svg: longDivSVG(g.V, g.D, '?'), cap: '세로셈' }], answer: Number(g.Q), unit: '', meta: g };
    }
    if (type === 'shift') {
      const g = genExact(), sa = decimals(g.D), sb = decimals(g.V);
      const opts = [];
      for (const e of [1, 2]) { if (e >= sb) opts.push({ e, blank: 'V' }); if (e >= sa) opts.push({ e, blank: 'D' }); }
      if (!opts.length) continue;
      const o = pick(opts), mult = P10(o.e);
      const A = times10(g.D, o.e), B = times10(g.V, o.e);
      const ans = o.blank === 'V' ? B : A;
      const left = `${g.D} ÷ ${g.V}`;
      const right = o.blank === 'V' ? `${A} ÷ □` : `□ ÷ ${B}`;
      return { type, text: `나누어지는 수와 나누는 수에 같은 수를 곱해도 몫은 같아요. □ 안에 알맞은 수를 쓰세요.<br>${b(left + ' = ' + right)}`,
        figs: [{ svg: shiftSVG([g.D, g.V], o.blank === 'V' ? [A, '?'] : ['?', B], mult), cap: '소수점을 똑같이 옮겨요' }], answer: Number(ans), unit: '', meta: { ...g, A, B, ans } };
    }
    if (type === 'word') {
      let g, t;
      if (Math.random() < 0.5) {   // 몇 개로 나누어지는지 (몫은 자연수)
        g = Math.random() < 0.5 ? genExact({ qd: 1, r: 0, maxQ: 20 }) : genNatural({ qd: 1, r: 0, maxQ: 20 });
        t = pick(WORD_COUNT)(g.D, g.V);
      } else {                     // 걸린 시간, 칠한 넓이처럼 몫이 소수여도 되는 문제
        g = Math.random() < 0.7 ? genExact({ qd: 1, bMin: 12, maxQ: 12 }) : genNatural({ qd: 1, bMin: 12, maxQ: 12 });
        t = pick(WORD_AMOUNT)(g.D, g.V);
      }
      return { type, text: t.text, figs: [{ svg: wordSVG(g.D, t.step, t.u === 'm²' ? 'L' : t.u, t.note), cap: '그림으로 보기' }], answer: Number(g.Q), unit: t.unit, meta: g };
    }
    if (type === 'point') {
      // 자연수의 나눗셈 a' ÷ b' = q' 를 이용해서 소수의 나눗셈 몫의 소수점 위치 찾기
      const bp = between(2, 25), qp = between(2, 30), ap = bp * qp;
      const i = between(1, 2), j = between(1, 2);
      const e = j - i;                                   // 몫에 곱해지는 10의 거듭제곱
      if (ap > 400 || ap % 10 === 0 || bp % 10 === 0) continue;
      const A = dec(ap, i), B = dec(bp, j);
      const qs = k => (k >= 0 ? String(qp * P10(k)) : dec(qp, -k));
      const exps = shuffle([-2, -1, 0, 1, 2].filter(k => k !== e)).slice(0, 3).concat(e);
      const vals = shuffle(exps.slice());
      const opts = vals.map(k => qs(k));
      if (new Set(opts).size < 4) continue;
      return { type, text: `${b(ap + ' ÷ ' + bp + ' = ' + qp)} 임을 이용하여 ${b(A + ' ÷ ' + B)}의 몫을 구하면?`,
        figs: [{ svg: pointSVG(`${ap} ÷ ${bp} = ${qp}`, `${A} ÷ ${B} = ?`), cap: '자연수의 나눗셈을 이용해요' }],
        options: opts.map(o => `<span class="otext">${o}</span>`), answer: vals.indexOf(e), meta: { A, B, correct: qs(e), opts } };
    }
    if (type === 'inverse') {
      if (Math.random() < 0.5) {
        // 곱셈식 □ × (소수) = (소수) → 나눗셈으로 □ 구하기 (□ = D ÷ V)
        const g = genExact();
        return { type, text: `□ 안에 알맞은 수를 구하세요. ${b('□ × ' + g.V + ' = ' + g.D)}`, figs: [{ svg: longDivSVG(g.V, g.D, '?'), cap: '나눗셈으로 바꾸어 구해요' }], answer: Number(g.Q), unit: '', meta: { ...g, ask: 'Q' } };
      }
      const g = genExact({ qd: 1, r: 0 });            // 몫 자연수, 나누는 수 소수 첫째 자리 → 답이 소수 첫째 자리 이내
      return { type, text: `□ 안에 알맞은 수를 구하세요. ${b(g.D + ' ÷ □ = ' + g.Q)}`, figs: [{ svg: longDivSVG('?', g.D, g.Q), cap: '나누는 수는?' }], answer: Number(g.V), unit: '', meta: { ...g, ask: 'V' } };
    }
    // compare: 몫이 가장 큰 / 가장 작은 식 고르기
    const list = [], seen = new Set();
    for (let t = 0; t < 80 && list.length < 4; t++) {
      const g = Math.random() < 0.25 ? genNatural() : genExact();
      const q = Number(g.Q);
      if ([...seen].some(x => Math.abs(x - q) < 0.8)) continue;
      seen.add(q); list.push(g);
    }
    if (list.length < 4) continue;
    const big = Math.random() < 0.5;
    const qs = list.map(g => Number(g.Q));
    const target = big ? Math.max(...qs) : Math.min(...qs);
    const order = shuffle(list.slice());
    return { type, text: `몫이 가장 ${big ? '큰' : '작은'} 것을 고르세요.`, figs: [{ svg: scaleSVG(), cap: '' }],
      options: order.map(g => `<span class="otext">${g.D} ÷ ${g.V}</span>`), answer: order.findIndex(g => Number(g.Q) === target), meta: { order, big } };
  }
  return makeProblem('calc');
}

// 학생마다 유형 주머니를 섞어서 차례로 꺼냄 → 일곱 유형이 골고루 나옴
function nextProblem(student) {
  if (!student.typeBag || !student.typeBag.length) student.typeBag = shuffle(TYPES.slice());
  return makeProblem(student.typeBag.pop());
}
// 학생에게 보낼 때는 정답과 meta를 뺀다
const publicProblem = p => ({ id: p.id, type: p.type, label: TYPE_LABEL[p.type], text: p.text, figs: p.figs, options: p.options || null, unit: p.unit || '' });
function check(p, value) {
  if (p.options) return Number(value) === p.answer;
  const v = String(value ?? '').trim().replace(',', '.');
  if (!/^\d*\.?\d+$/.test(v)) return false;           // 숫자와 소수점 하나만
  return Math.abs(Number(v) - p.answer) < 1e-9;       // 4.2 와 4.20 은 같은 답
}

module.exports = { nextProblem, publicProblem, check, TYPES, makeProblem };
