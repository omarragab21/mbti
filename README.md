# اختبار MBTI السريع 🧠

تطبيق ويب عربي متكامل لاختبار MBTI السريع مبني بـ **Next.js App Router** مع تحليل شخصية بالذكاء الاصطناعي.

---

## المتطلبات

- Node.js 20.19+
- npm

---

## التثبيت والإعداد

### 1. استنساخ المشروع وتثبيت الحزم

```bash
git clone <repo-url>
cd mbti
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف `.env.example` وأعد تسميته:

```bash
cp .env.example .env
```

ثم أضف متغيرات البيئة في ملف `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1
```

> **ملاحظة:** لا تشارك مفتاح API أبدًا. يُستخدم فقط من جانب الخادم.
> SQLite مناسب للتطوير المحلي فقط. في الإنتاج على Vercel استخدم قاعدة بيانات دائمة مثل PostgreSQL، ثم حدّث Prisma provider/adapter بما يناسبها قبل استقبال بيانات حقيقية.

### 3. إعداد قاعدة البيانات

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. تشغيل التطبيق

```bash
npm run dev
```

افتح المتصفح على: **http://localhost:3000**

---

## صفحات التطبيق

| الصفحة | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/t/mbti-quick-test` | رابط الاختبار العام |
| `/t/[slug]` | أي اختبار بالرابط الخاص |
| `/admin` | لوحة التحكم |
| `/admin/tests` | قائمة الاختبارات |
| `/admin/tests/new` | إنشاء اختبار جديد |
| `/admin/tests/[id]/edit` | تعديل اختبار |

---

## كيفية إنشاء اختبار

1. افتح `/admin/tests`
2. اضغط **"إنشاء اختبار جديد"**
3. أدخل عنوان الاختبار والرابط الفريد ونص المقدمة
4. اكتب نص كل سؤال من الأسئلة الأربعة مع الخيارين
5. اضغط **"إنشاء الاختبار"**

---

## كيفية مشاركة رابط الاختبار

بعد إنشاء الاختبار:

1. افتح `/admin/tests`
2. اضغط **"نسخ الرابط"** لنسخ الرابط
3. أو اضغط **"معاينة"** لفتح الاختبار
4. في صفحة التعديل، يوجد زر **"واتساب"** لمشاركة مباشرة

الرابط يكون بالشكل:
```
https://yourdomain.com/t/mbti-quick-test
```

---

## كيف يعمل تحليل الذكاء الاصطناعي

1. المستخدم يجيب على الأسئلة الأربعة
2. يظهر نمط MBTI المحسوب (مثل: ENTJ)
3. المستخدم يضغط **"تحليل شخصيتي بالذكاء الاصطناعي"**
4. يتم إرسال طلب POST إلى `/api/analyze-mbti`
5. الخادم يستدعي OpenAI GPT مع prompt عربي متخصص
6. يُعرض التحليل في واجهة منظمة ومنسقة

> مفتاح OpenAI API يبقى على الخادم فقط — لا يُكشف أبدًا للمتصفح.

---

## أوامر قاعدة البيانات

```bash
# توليد Prisma Client
npx prisma generate

# رفع Schema إلى قاعدة البيانات
npx prisma db push

# تشغيل Seed (البيانات الافتراضية)
npx prisma db seed

# فتح واجهة إدارة قاعدة البيانات
npm run db:studio
```

## النشر على Vercel

قبل النشر تأكد من إضافة متغيرات البيئة في Vercel:

```bash
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_MODEL production
vercel env add DATABASE_URL production
```

ثم انشر:

```bash
npm install
npm run build
vercel login
vercel link
vercel --prod
```

أمر البناء يشغّل `prisma generate` تلقائيًا قبل `next build`.

---

## هيكل المشروع

```
app/
  page.tsx                    # الصفحة الرئيسية
  admin/
    page.tsx                  # لوحة التحكم
    tests/
      page.tsx                # قائمة الاختبارات
      new/page.tsx            # اختبار جديد
      [id]/edit/page.tsx      # تعديل اختبار
  t/[slug]/page.tsx           # رابط الاختبار العام
  api/
    analyze-mbti/route.ts     # OpenAI API
    tests/route.ts            # CRUD الاختبارات
    tests/[id]/route.ts       # عمليات فردية
    results/route.ts          # حفظ النتائج
components/
  TestRunner.tsx              # محرك الاختبار
  ResultCard.tsx              # شاشة النتيجة
  AdminTestForm.tsx           # نموذج الإدارة
  ShareButtons.tsx            # أزرار المشاركة
  LoadingState.tsx            # حالة التحميل
lib/
  prisma.ts                   # Prisma singleton
  openai.ts                   # OpenAI client
  mbti.ts                     # منطق MBTI
  utils.ts                    # أدوات مساعدة
prisma/
  schema.prisma               # نموذج قاعدة البيانات
  seed.ts                     # بيانات افتراضية
  dev.db                      # SQLite (محلي)
```

---

## Tech Stack

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 16 App Router | إطار العمل الرئيسي |
| TypeScript | كتابة النوع |
| Tailwind CSS v4 | التصميم |
| Framer Motion | الرسوم المتحركة |
| Prisma ORM v7 | قاعدة البيانات |
| SQLite + better-sqlite3 | قاعدة البيانات المحلية |
| OpenAI Node SDK | تحليل الشخصية |
| Zod | التحقق من البيانات |

---

## نمط MBTI المدعوم

| النمط | العنوان |
|-------|---------|
| ISTJ | المفتش |
| ISFJ | الحامي |
| INFJ | المستشار |
| INTJ | المخطط |
| ISTP | الحرفي |
| ISFP | الفنان |
| INFP | المثالي |
| INTP | المفكر |
| ESTP | المغامر |
| ESFP | الاجتماعي |
| ENFP | الملهم |
| ENTP | المبتكر |
| ESTJ | التنفيذي |
| ESFJ | الداعم |
| ENFJ | القائد الملهم |
| ENTJ | القائد الاستراتيجي |
# mbti
