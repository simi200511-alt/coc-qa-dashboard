// Vercel Serverless Function: GET /api/get-data
// อ่านลิงก์จริงจาก Environment Variable (ไม่อยู่ในโค้ด/GitHub) แล้วส่งข้อมูลกลับให้หน้าเว็บ
module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiUrl = process.env.GOOGLE_SHEET_API_URL;
  if (!apiUrl) {
    // ไม่บอกรายละเอียดภายใน เพื่อไม่ให้เปิดเผยโครงสร้างระบบ
    return res.status(500).json({ error: "Server is not configured" });
  }

  try {
    const upstream = await fetch(apiUrl, { redirect: "follow" }); // Apps Script มักตอบกลับผ่าน redirect
    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream error" });
    }
    const body = await upstream.text();
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "text/plain; charset=utf-8"
    );
    // แคช 5 นาทีที่ Edge ของ Vercel ลดการเรียก Google และทำให้โหลดเร็วขึ้น
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).send(body);
  } catch (err) {
    console.error("get-data failed"); // ไม่ log URL
    return res.status(502).json({ error: "Failed to fetch data" });
  }
};
