# WHOCARE CLINIC

เว็บไซต์คลินิกศัลยกรรมความงาม Whocare Clinic

## การเตรียมเครื่อง (Prerequisites)

ก่อนเริ่ม ให้ติดตั้งโปรแกรมและเครื่องมือเหล่านี้:
- Cloudflare WARP (จำเป็นสำหรับการเชื่อมต่อฐานข้อมูล)
- Node.js (LTS >= 18) และ npm
- Git
- PostgreSQL หรือ Docker (สำหรับรันฐานข้อมูล)
- (แนะนำ) Visual Studio Code

ตัวอย่างคำสั่งติดตั้งบน Windows (ใช้ winget):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install PostgreSQL.PostgreSQL
# หรือ ติดตั้ง Docker Desktop
winget install Docker.DockerDesktop
```

ตรวจสอบเวอร์ชัน:

```powershell
node -v
npm -v
git --version
psql --version
docker --version
```

ตัวอย่างรัน Postgres ด้วย Docker:

```bash
docker run --name whocare-postgres -e POSTGRES_USER=whocare -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=whocare_db -p 5432:5432 -d postgres:15
```

## Cloudflare WARP — ติดตั้งและตั้งค่า

โปรเจกต์นี้ใช้การเชื่อมต่อฐานข้อมูลผ่าน WARP IPv6 (ไลบรารี `pg-cloudflare` จะส่งทราฟิกผ่าน WARP) — จึงต้องเปิด Cloudflare WARP บนเครื่องก่อนรัน `backend` เพื่อให้การเชื่อมต่อกับ Supabase/Postgres สำเร็จ

1) ติดตั้ง WARP

- Windows / macOS: ดาวน์โหลดแอป "1.1.1.1 with WARP" จาก
	https://1.1.1.1/ หรือ https://developers.cloudflare.com/warp-client/ แล้วรันตัวติดตั้ง

- Linux (ตัวอย่าง Ubuntu/Debian): ดูคำแนะนำอย่างเป็นทางการที่
	https://developers.cloudflare.com/warp-client/warp-for-linux/  แต่ตัวอย่างสั้น ๆ:

```bash
# เพิ่ม repository ของ Cloudflare (ตัวอย่างสำหรับ Debian/Ubuntu)
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ jammy main' | sudo tee /etc/apt/sources.list.d/cloudflare-client.list
sudo apt update
sudo apt install cloudflare-warp
# เริ่ม service และเชื่อมต่อ (ขึ้นกับเวอร์ชันของแพ็กเกจ)
sudo systemctl enable --now warp-svc
sudo warp-cli register
sudo warp-cli connect
```

2) เปิด WARP ให้เป็น "Connected"

- บนเดสก์ท็อป ให้เปิดแอป 1.1.1.1 และสวิตช์ WARP เป็น `Connected` (สีเขียว)
- บน CLI ให้รัน `warp-cli status` เพื่อยืนยันสถานะเป็น connected

3) ยืนยันการทำงานของ WARP (ตรวจสอบว่า WARP เปิดอยู่และ IPv6 ทำงาน)

```bash
curl https://www.cloudflare.com/cdn-cgi/trace | grep warp
# ควรเห็น `warp=on` หรือ `warp=plus` เมื่อเชื่อมต่อสำเร็จ
```

4) หลังจากเปิด WARP แล้ว ให้รัน backend ตามขั้นตอนปกติ (เช่น `cd backend && npm run dev`) — ถ้าการเชื่อมต่อ DB ล้มเหลว ให้ตรวจสอบว่า `DB_HOST` ใน `backend/.env` เป็น host ของ Supabase และ WARP กำลังเชื่อมต่ออยู่


## ดาวน์โหลดโค้ด (Clone / Download ZIP)

สามารถดาวน์โหลดซอร์สโค้ดได้ 2 วิธี:

- Clone ผ่าน Git:

```bash
git clone <repo-url>
cd whocareV2
```

- ดาวน์โหลดเป็น ZIP จาก GitHub:

1. ไปที่หน้ารีโพ (GitHub) คลิก "Code" → "Download ZIP"
2. แตกไฟล์ (Windows PowerShell):

```powershell
Expand-Archive -Path .\whocareV2-main.zip -DestinationPath .
cd whocareV2-main
```

- เปิดโปรเจกต์ใน VS Code:

```powershell
code .
```

หมายเหตุ: ถ้าใช้ ZIP ให้แน่ใจว่าอยู่ในโฟลเดอร์รากโปรเจกต์ชื่อ `whocareV2` ก่อนรันคำสั่ง `npm install`.

## วิธีใช้งาน

### 1. ติดตั้ง
```download

```bash
git clone <repo-url>
cd whocareV2

# ติดตั้ง Frontend
npm install

# ติดตั้ง Backend
cd backend
npm install
```

### 2. ตั้งค่า Environment

สร้างไฟล์ `backend/.env` แล้วใส่ค่าต่อไปนี้:

```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=รับจาก Admin
DB_NAME=postgres
DB_SSL=true
JWT_SECRET=random-string
JWT_REFRESH_SECRET=random-string
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 3. รันโปรเจค

เปิด 2 terminal:

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
cd backend
npm run dev
```

Frontend จะรันที่ `http://localhost:5173` และ Backend ที่ `http://localhost:5000`
