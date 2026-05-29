#!/usr/bin/env node
/*
  굿메세지 — KJV/WEB 본문 수집 스크립트

  사용법:
    node scripts/fetch_verse_texts.js
    node scripts/fetch_verse_texts.js --only=kjv
    node scripts/fetch_verse_texts.js --only=web

  동작:
    - data/verses.json의 각 ref(en)에 대해 https://bible-api.com 에서 KJV/WEB 본문을 받아
      data/texts_kjv.json, data/texts_web.json 에 저장합니다.
    - 이미 저장된 키는 건너뜁니다(증분 실행). 50개마다 디스크에 저장합니다.
    - 요청 사이 120ms 지연을 두어 서비스에 부담을 주지 않습니다.

  요구:
    - Node.js 18+ (전역 fetch 사용). 추가 패키지 없음.
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VERSES = path.join(ROOT, "data", "verses.json");
const PATHS = {
  kjv: path.join(ROOT, "data", "texts_kjv.json"),
  web: path.join(ROOT, "data", "texts_web.json"),
};

const args = process.argv.slice(2);
const onlyArg = (args.find(a => a.startsWith("--only=")) || "").split("=")[1] || "";
const only = onlyArg ? onlyArg.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : ["kjv", "web"];

function loadJson(p, fallback){
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch(_) { return fallback; }
}
function saveJson(p, obj){
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function fetchOne(ref, translation){
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}&verse_numbers=false`;
  const r = await fetch(url);
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  const text = (j.text || "").replace(/\s+/g, " ").trim();
  if(!text) throw new Error("empty body");
  return text;
}

(async function main(){
  if(typeof fetch !== "function"){
    console.error("Node 18+ 가 필요합니다 (전역 fetch 미지원). 현재:", process.version);
    process.exit(1);
  }
  const versesDoc = loadJson(VERSES, null);
  if(!versesDoc || !Array.isArray(versesDoc.verses)){
    console.error(`data/verses.json 을 읽을 수 없습니다: ${VERSES}`);
    process.exit(1);
  }
  const verses = versesDoc.verses;
  console.log(`총 ${verses.length}개 ref. 받을 번역: ${only.join(", ")}`);

  const stores = {};
  for(const t of only) stores[t] = loadJson(PATHS[t], {});

  let added = 0, skipped = 0, failed = 0;
  for(let i = 0; i < verses.length; i++){
    const v = verses[i];
    const key = v.en;
    for(const t of only){
      const store = stores[t];
      if(store[key]){ skipped++; continue; }
      try{
        const text = await fetchOne(key, t);
        store[key] = text;
        added++;
        await sleep(120);
      }catch(e){
        failed++;
        console.error(`\n[${t}] ${key} 실패: ${e.message}`);
      }
    }
    process.stdout.write(`\r[${i+1}/${verses.length}] +${added}  skip:${skipped}  fail:${failed}    `);
    if(i % 50 === 49 || i === verses.length - 1){
      for(const t of only) saveJson(PATHS[t], stores[t]);
    }
  }
  console.log(`\n완료. 추가:${added}  건너뜀:${skipped}  실패:${failed}`);
  for(const t of only){
    console.log(`  ${t.toUpperCase()}: ${Object.keys(stores[t]).length}개  →  ${PATHS[t]}`);
  }
})();
