export type TestOption = {
  id: string;
  label: string;
  value: string;
};

export type TestQuestion = {
  id: string;
  order: number;
  title: string;
  axis: string;
  options: TestOption[];
};

export type TestRecord = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  resultCount: number;
  questions: TestQuestion[];
};

export type TestFormOption = {
  id?: string;
  label: string;
  value: string;
};

export type TestFormQuestion = {
  id?: string;
  order: number;
  title: string;
  axis: string;
  options: [TestFormOption, TestFormOption];
};

export type TestFormInput = {
  title: string;
  slug: string;
  intro: string;
  questions: TestFormQuestion[];
};

export type TestSummary = Omit<TestRecord, 'questions'> & {
  _count: {
    questions: number;
    results: number;
  };
};

export type SavedResult = {
  id: string;
  testId: string;
  mbtiType: string;
  mbtiTitle: string;
  answersJson: string;
  createdAt: string;
};

type Store = {
  tests: TestRecord[];
  results: SavedResult[];
};

const DEFAULT_TEST: TestRecord = {
  id: 'test_mbti_quick',
  title: 'اختبار MBTI السريع',
  slug: 'mbti-quick-test',
  intro: 'اكتشف نمط شخصيتك من خلال ٤ أسئلة فقط.',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  resultCount: 0,
  questions: [
    {
      id: 'q_energy',
      order: 1,
      title: 'كيف تكتسب طاقتك غالبًا؟',
      axis: 'E-I',
      options: [
        { id: 'q_energy_e', label: 'اجتماعي — أستمد طاقتي من الناس والتجمعات', value: 'E' },
        { id: 'q_energy_i', label: 'هادئ — أستمد طاقتي من وقتي الشخصي', value: 'I' },
      ],
    },
    {
      id: 'q_perception',
      order: 2,
      title: 'كيف ترى العالم من حولك؟',
      axis: 'S-N',
      options: [
        { id: 'q_perception_s', label: 'واقعي — أركز على التفاصيل والحقائق الملموسة', value: 'S' },
        { id: 'q_perception_n', label: 'خيالي — أركز على الأفكار والاحتمالات المستقبلية', value: 'N' },
      ],
    },
    {
      id: 'q_decision',
      order: 3,
      title: 'كيف تتخذ قراراتك غالبًا؟',
      axis: 'T-F',
      options: [
        { id: 'q_decision_t', label: 'منطقي — أعتمد على التحليل والمنطق', value: 'T' },
        { id: 'q_decision_f', label: 'عاطفي — أعتمد على المشاعر والقيم الإنسانية', value: 'F' },
      ],
    },
    {
      id: 'q_lifestyle',
      order: 4,
      title: 'ما أسلوبك في الحياة؟',
      axis: 'J-P',
      options: [
        { id: 'q_lifestyle_j', label: 'منظم — أفضل التخطيط والنظام والوضوح', value: 'J' },
        { id: 'q_lifestyle_p', label: 'مرن — أفضل التلقائية والتكيف مع المستجدات', value: 'P' },
      ],
    },
  ],
};

const globalForTests = globalThis as unknown as {
  mbtiStore: Store | undefined;
};

function cloneTest(test: TestRecord): TestRecord {
  return {
    ...test,
    questions: test.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    })),
  };
}

function getStore() {
  if (!globalForTests.mbtiStore) {
    globalForTests.mbtiStore = {
      tests: [cloneTest(DEFAULT_TEST)],
      results: [],
    };
  }

  return globalForTests.mbtiStore;
}

function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

function toSummary(test: TestRecord): TestSummary {
  const { questions, ...rest } = test;

  return {
    ...rest,
    _count: {
      questions: questions.length,
      results: test.resultCount,
    },
  };
}

function normalizeQuestions(questions: TestFormQuestion[]): TestQuestion[] {
  return questions
    .map((question) => ({
      id: question.id || makeId('question'),
      order: question.order,
      title: question.title,
      axis: question.axis,
      options: question.options.map((option) => ({
        id: option.id || makeId('option'),
        label: option.label,
        value: option.value,
      })),
    }))
    .sort((a, b) => a.order - b.order);
}

export function listTests() {
  return getStore()
    .tests
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toSummary);
}

export function getTestById(id: string) {
  const test = getStore().tests.find((item) => item.id === id);
  return test ? cloneTest(test) : null;
}

export function getTestBySlug(slug: string, options: { activeOnly?: boolean } = {}) {
  const test = getStore().tests.find((item) => {
    if (item.slug !== slug) return false;
    return options.activeOnly ? item.isActive : true;
  });

  return test ? cloneTest(test) : null;
}

export function isSlugTaken(slug: string, exceptId?: string) {
  return getStore().tests.some((test) => test.slug === slug && test.id !== exceptId);
}

export function createTest(input: TestFormInput) {
  const now = new Date().toISOString();
  const test: TestRecord = {
    id: makeId('test'),
    title: input.title,
    slug: input.slug,
    intro: input.intro,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    resultCount: 0,
    questions: normalizeQuestions(input.questions),
  };

  getStore().tests.unshift(test);

  return cloneTest(test);
}

export function updateTest(id: string, input: TestFormInput) {
  const store = getStore();
  const index = store.tests.findIndex((test) => test.id === id);

  if (index === -1) {
    return null;
  }

  const existing = store.tests[index];
  const updated: TestRecord = {
    ...existing,
    title: input.title,
    slug: input.slug,
    intro: input.intro,
    updatedAt: new Date().toISOString(),
    questions: normalizeQuestions(input.questions),
  };

  store.tests[index] = updated;

  return cloneTest(updated);
}

export function deleteTest(id: string) {
  const store = getStore();
  const initialLength = store.tests.length;
  store.tests = store.tests.filter((test) => test.id !== id);
  store.results = store.results.filter((result) => result.testId !== id);

  return store.tests.length !== initialLength;
}

export function saveResult(input: Omit<SavedResult, 'id' | 'createdAt'>) {
  const store = getStore();
  const result: SavedResult = {
    id: makeId('result'),
    createdAt: new Date().toISOString(),
    ...input,
  };

  store.results.push(result);

  const test = store.tests.find((item) => item.id === input.testId);
  if (test) {
    test.resultCount += 1;
  }

  return result;
}
