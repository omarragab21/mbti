import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, './dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.result.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();

  const test = await prisma.test.create({
    data: {
      title: 'اختبار MBTI السريع',
      slug: 'mbti-quick-test',
      intro: 'اكتشف نمط شخصيتك من خلال ٤ أسئلة فقط.',
      isActive: true,
      questions: {
        create: [
          {
            order: 1,
            title: 'كيف تكتسب طاقتك غالبًا؟',
            axis: 'E-I',
            options: {
              create: [
                { label: 'اجتماعي — أستمد طاقتي من الناس والتجمعات', value: 'E' },
                { label: 'هادئ — أستمد طاقتي من وقتي الشخصي', value: 'I' },
              ],
            },
          },
          {
            order: 2,
            title: 'كيف ترى العالم من حولك؟',
            axis: 'S-N',
            options: {
              create: [
                { label: 'واقعي — أركز على التفاصيل والحقائق الملموسة', value: 'S' },
                { label: 'خيالي — أركز على الأفكار والاحتمالات المستقبلية', value: 'N' },
              ],
            },
          },
          {
            order: 3,
            title: 'كيف تتخذ قراراتك غالبًا؟',
            axis: 'T-F',
            options: {
              create: [
                { label: 'منطقي — أعتمد على التحليل والمنطق', value: 'T' },
                { label: 'عاطفي — أعتمد على المشاعر والقيم الإنسانية', value: 'F' },
              ],
            },
          },
          {
            order: 4,
            title: 'ما أسلوبك في الحياة؟',
            axis: 'J-P',
            options: {
              create: [
                { label: 'منظم — أفضل التخطيط والنظام والوضوح', value: 'J' },
                { label: 'مرن — أفضل التلقائية والتكيف مع المستجدات', value: 'P' },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created test: "${test.title}" with slug: "${test.slug}"`);
  console.log(`🔗 Public URL: /t/${test.slug}`);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
