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
"1bjPxk8huPaLV7Og_H0KwEpGrLpxc2xGy"
,
"1oNcEvl6DoUN2lOMxdtHeESlkEvQd0-4W"
,
"1SMIUIOrMrrSTKmj9KiSIMfbH0avqj_DW"
,
"10iB9DfL159jgB5xic-FKkErRV-kHbo-6"
,
"15_9_fhK5nu1tmkzX3Fbu4ReUL4RH7bRJ"
,
"1EF5lxmUE-AETPqgxdHKg9f3UVvQcSghm"
,
"1sF6El1sMDOku9zszLBZevi3lIy9F1Cf2"
,
"1RT7cTllImgzdlghQjz8H69Yg5mKRX1gV"
,
"18B09NmbSfwlgP2m_UryhVE48aa3Icbpm"
]);

export default async function handler(req, res) {
  const id = String(req.query.id || "");
  if (!ALLOWED.has(id)) {
    res.status(404).end("Not found");
    return;
  }

  const headers = {};
  if (req.headers.range) headers.Range = req.headers.range;

  const upstream = await fetch(
    "https://drive.usercontent.google.com/download?id=" + encodeURIComponent(id) + "&export=download&confirm=t",
    { headers, redirect: "follow" }
  );

  if (!upstream.ok && upstream.status !== 206) {
    res.status(upstream.status || 502).end("Video unavailable");
    return;
  }

  const passHeaders = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified"
  ];
  for (const h of passHeaders) {
    const v = upstream.headers.get(h);
    if (v) res.setHeader(h, v);
  }
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");

  res.status(upstream.status);
  if (!upstream.body) {
    res.end();
    return;
  }

  const reader = upstream.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}
