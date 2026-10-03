# CoC QA Dashboard: Academic Publications

แดชบอร์ดแสดงผลงานทางวิชาการของอาจารย์ วิทยาลัยการคอมพิวเตอร์ (CoC)
รายวิชา **Visualization** · **หัวข้อที่ 2: ผลงานทางวิชาการของอาจารย์วิทยาลัยการคอมพิวเตอร์**

🌐 **เว็บไซต์:** https://coc-qa-dashboard.vercel.app

## 👥 สมาชิกกลุ่ม

| ลำดับ | ชื่อ-นามสกุล | รหัสนักศึกษา |
|:---:|---|---|
| 1 | นาย เจตนิพัทธ์ ทองเชื้อ | 6730614002 |
| 2 | นางสาว สิมิลันนา พาล์เมียรี่ ชไวเกิร์ต | 6730614003 |
| 3 | นางสาว ณัฐกานต์ ดาวช่วย | 6730614036 |

## 📌 ภาพรวม

ระบบอ่านข้อมูลผลงานตีพิมพ์จาก **Google Sheets** ผ่านลิงก์ CSV ที่เผยแพร่จากชีต แล้วแสดงเป็นกราฟบนหน้าเว็บ
ผู้ใช้เลือกช่วงปี อาจารย์ หลักสูตร และฐานข้อมูล (Indexing) ได้เอง

## ✅ ความต้องการตามโจทย์

| ข้อกำหนด | สถานะ | วิธีที่ทำ |
|---|:---:|---|
| อ่านข้อมูลจาก Google Sheet | ✅ | Google Sheets (CSV) → Serverless Function → หน้าเว็บ |
| เลือกช่วงเวลาได้ | ✅ | ช่องปีเริ่มต้น/สิ้นสุด (ค.ศ.) |
| กรองรายชื่ออาจารย์ | ✅ | ตัวเลือกชื่ออาจารย์ |
| กราฟผลงานรวมรายปี | ✅ | กราฟแท่ง |
| แยกตามประเภทผลงาน | ✅ | กราฟแท่งแบบ stacked + กราฟโดนัท |
| แยกตามหลักสูตร | ✅ | กราฟแท่งแบบ stacked + กราฟแยกหลักสูตร |

## 🏗️ สถาปัตยกรรมและความปลอดภัย

```
ผู้ใช้ → index.html (Vercel) → /api/get-data (Serverless Function) → Google Sheets (เผยแพร่เป็น CSV)
                                        ↑
                      อ่าน URL จาก Environment Variable
                      GOOGLE_SHEET_API_URL (เก็บบน Vercel เท่านั้น)
```

**หลักการออกแบบ**
- หน้าเว็บเรียกเฉพาะ `/api/get-data` ซึ่งเป็นที่อยู่ภายในโดเมนของโปรเจกต์เอง
- ลิงก์ข้อมูลจริงเก็บใน **Environment Variable** บน Vercel จึงไม่อยู่ในซอร์สโค้ดและไม่ถูกเผยแพร่บน GitHub
- ฟังก์ชันไม่แสดงลิงก์ข้อมูลในข้อความ error หรือ log
- แคชผลลัพธ์ 5 นาทีที่ Edge ของ Vercel ลดการเรียก Google และโหลดเร็วขึ้น
- รับเฉพาะ method `GET`
- ไฟล์ `.gitignore` กันไม่ให้ไฟล์ `.env` ถูกอัปโดยไม่ตั้งใจ

> **ข้อควรทราบ:** วิธีนี้ซ่อน **URL ของแหล่งข้อมูล** แต่ข้อมูลที่แสดงบนกราฟยังเปิดดูได้ผ่าน `/api/get-data` เพราะหน้าเว็บต้องใช้ข้อมูลชุดเดียวกัน หากต้องการจำกัดผู้เข้าชม ควรเพิ่มระบบล็อกอิน

## 🗂️ โครงสร้างโปรเจกต์

```
coc-qa-dashboard/
├── index.html          # หน้าเว็บ (ไม่มี URL ข้อมูลอยู่ในไฟล์)
├── api/
│   └── get-data.js     # Serverless Function (ฝั่งเซิร์ฟเวอร์)
├── .env.example        # ตัวอย่างตัวแปรแวดล้อม (ไม่มีค่าจริง)
├── .gitignore          # ป้องกันไฟล์ลับถูกอัปขึ้น GitHub
└── README.md
```

## ⚙️ การตั้งค่า Environment Variable

| ชื่อตัวแปร | ความหมาย |
|---|---|
| `GOOGLE_SHEET_API_URL` | ลิงก์ CSV ของ Google Sheets ที่เผยแพร่ (ไฟล์ → แชร์ → เผยแพร่ไปยังเว็บ → CSV) |

### บน Vercel
1. เข้า https://vercel.com แล้วกด **Add New → Project** เลือก repo นี้จาก GitHub
2. ที่หน้า Configure Project เปิดส่วน **Environment Variables**
3. ใส่ Name: `GOOGLE_SHEET_API_URL` และ Value: ลิงก์ CSV ของ Google Sheets แล้วกด **Add**
4. กด **Deploy**
5. หากแก้ค่าภายหลัง ให้ไปที่ **Settings → Environment Variables** แล้วกด **Redeploy** เพื่อให้ค่าใหม่มีผล

### ทดสอบในเครื่อง
```bash
npm install -g vercel
cp .env.example .env.local     # แล้วแก้ค่าใน .env.local
vercel dev
```
เปิด http://localhost:3000

## 🗃️ คอลัมน์ข้อมูลที่ระบบใช้

`Year`, `Staff name`, `Indexing`, `Type`, `Program`
(รองรับชื่อทางเลือก: `ปี`, `ชื่ออาจารย์`, `ฐานข้อมูล`, `ประเภท`, `Curriculum`, `หลักสูตร`, `Major`)
ปี พ.ศ. จะถูกแปลงเป็น ค.ศ. อัตโนมัติ และรองรับข้อมูลที่ API ส่งมาเป็น JSON หรือ CSV

## 🔄 เปลี่ยนแหล่งข้อมูลในอนาคต

ไม่ต้องแก้โค้ดหรือ GitHub: แก้ค่า `GOOGLE_SHEET_API_URL` บน Vercel แล้ว Redeploy

## 🛠️ เทคโนโลยี

HTML/CSS/JavaScript · Bootstrap 5 · Chart.js · PapaParse · Vercel Serverless Functions (Node.js) · Google Sheets (Publish to web)
