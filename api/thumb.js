const ALLOWED = new Set([
"1jehLxi3AbDH1pfS5Mwroga5QlZmeF_nP",
"1Gbh9PaNkOyD99Iv41HTKZ-UOFZjHEUb7",
"1CCrJmTGxYEG5Z4N-FvFVM0LW58YVvw_x",
"1u7GEsYQ9VXK1G9_bqNn82aDSy5714M54",
"1ysOOigGUm1V6wtwtHaH1E2-puU1sh1J7",
"1eIJWuYvwjq50g4gbMSG3zJ8moG_UY8s8",
"1JqPWPtba6G9XoJ8jByjkAaoUwbOZvmjc",
"10JJnhOfIJKDadFhXjM9rJXlAd72uMVge",
"1-iwzKFqRSB365xAolHARJ0quTHNpJWVH",
"1bjPxk8huPaLV7Og_H0KwEpGrLpxc2xGy",
"1oNcEvl6DoUN2lOMxdtHeESlkEvQd0-4W",
"1SMIUIOrMrrSTKmj9KiSIMfbH0avqj_DW",
"10iB9DfL159jgB5xic-FKkErRV-kHbo-6",
"15_9_fhK5nu1tmkzX3Fbu4ReUL4RH7bRJ",
"1EF5lxmUE-AETPqgxdHKg9f3UVvQcSghm",
"1sF6El1sMDOku9zszLBZevi3lIy9F1Cf2"
]);

const esc = s => String(s || "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function lines(text,max=22){
  const words=String(text||"").trim().split(/\s+/);
  const out=[]; let line="";
  for(const w of words){
    const next=line?line+" "+w:w;
    if(next.length>max && line){out.push(line);line=w}else line=next;
  }
  if(line)out.push(line);
  return out.slice(0,3);
}

export default async function handler(req,res){
  const id=String(req.query.id||"");
  if(!ALLOWED.has(id)){res.status(404).end("Not found");return}
  const title=esc(req.query.title||"Projeto");
  const brand=esc(req.query.brand||"Atrium Visual");
  try{
    const r=await fetch("https://drive.google.com/thumbnail?id="+encodeURIComponent(id)+"&sz=w1600",{redirect:"follow"});
    if(!r.ok) throw new Error("thumb");
    const buf=Buffer.from(await r.arrayBuffer());
    const ct=r.headers.get("content-type")||"image/jpeg";
    const b64=buf.toString("base64");
    const ls=lines(title,23);
    const tspans=ls.map((l,i)=>'<tspan x="58" dy="'+(i?58:0)+'">'+l+'</tspan>').join("");
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
<defs>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset=".36" stop-color="#02060a" stop-opacity="0"/><stop offset=".68" stop-color="#02060a" stop-opacity=".36"/><stop offset="1" stop-color="#02060a" stop-opacity=".96"/></linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ee8ff"/><stop offset=".25" stop-color="#4ecbff"/><stop offset=".55" stop-color="#ffffff" stop-opacity=".12"/><stop offset=".78" stop-color="#ffc36e"/><stop offset="1" stop-color="#ff9f34"/></linearGradient>
  <radialGradient id="blue" cx=".16" cy="0" r=".58"><stop stop-color="#54d2ff" stop-opacity=".22"/><stop offset="1" stop-color="#54d2ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="amber" cx=".55" cy="1" r=".62"><stop stop-color="#ffa43a" stop-opacity=".34"/><stop offset="1" stop-color="#ffa43a" stop-opacity="0"/></radialGradient>
  <clipPath id="clip"><rect x="8" y="8" width="704" height="884" rx="46"/></clipPath>
</defs>
<g clip-path="url(#clip)">
  <image href="data:${ct};base64,${b64}" x="8" y="8" width="704" height="884" preserveAspectRatio="xMidYMid slice"/>
  <rect x="8" y="8" width="704" height="884" fill="url(#shade)"/>
  <rect x="8" y="8" width="704" height="884" fill="url(#blue)"/>
  <rect x="8" y="8" width="704" height="884" fill="url(#amber)"/>
</g>
<rect x="8" y="8" width="704" height="884" rx="46" fill="none" stroke="url(#rim)" stroke-width="3"/>
<text x="662" y="50" text-anchor="end" fill="#eef5f8" fill-opacity=".80" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="4">ATRIUM VISUAL</text>
<line x1="58" y1="648" x2="110" y2="648" stroke="#ff5a36" stroke-width="5" stroke-linecap="round"/>
<text x="58" y="688" fill="#ff6a46" font-family="Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="3">${brand.toUpperCase()}</text>
<text x="58" y="748" fill="#f8f4ed" font-family="Arial,sans-serif" font-size="48" font-weight="800" letter-spacing="-1">${tspans}</text>
</svg>`;
    res.setHeader("Content-Type","image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control","public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).send(svg);
  }catch(e){
    res.status(502).end("Thumbnail unavailable");
  }
}
