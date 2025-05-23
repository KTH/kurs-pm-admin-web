const ladokCourseRounds = [
  {
    uid: 'bab6676e-9a88-11ee-bfe5-0721067a4fbf',
    status: { code: 'S3', nameSv: 'Komplett', nameEn: 'Complete' },
    tillfalleskod: '51505',
    startperiod: { code: 'HT2024', inDigits: '20242' },
    utbildningstillfalleskod: '51505',
    forstaUndervisningsdatum: { date: '2024-08-26', year: 2024, week: 35 },
    sistaUndervisningsdatum: { date: '2024-10-27', year: 2024, week: 43 },
    malgrupp: 'CDEPR1, CENMI1, CLGYM, TEMI2',
    kortnamn: 'CDEPR1 m.fl.',
    urvalskriterier: undefined,
    undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
    undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
    undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
    studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
    studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
    finansieringsform: {
      id: '101050',
      code: 'ORD',
      name: 'Ordinarie anslagsfinansiering',
    },
    minantalplatser: undefined,
    utbildningsplatser: undefined,
  },
  {
    uid: '0772a941-98c8-11ee-888d-8a62d8d3440a',
    status: { code: 'S3', nameSv: 'Komplett', nameEn: 'Complete' },
    tillfalleskod: '50233',
    startperiod: { code: 'HT2024', inDigits: '20242' },
    utbildningstillfalleskod: '50233',
    forstaUndervisningsdatum: { date: '2024-10-28', year: 2024, week: 44 },
    sistaUndervisningsdatum: { date: '2025-01-13', year: 2025, week: 3 },
    malgrupp: undefined,
    kortnamn: 'CMETE1 m.fl.',
    urvalskriterier: undefined,
    undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
    undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
    undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
    studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
    studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
    finansieringsform: {
      id: '101050',
      code: 'ORD',
      name: 'Ordinarie anslagsfinansiering',
    },
    minantalplatser: undefined,
    utbildningsplatser: undefined,
  },
  {
    uid: '1e16c308-3936-11ef-b4df-74ace29d47e8',
    status: { code: 'S2', nameSv: 'Påbörjad', nameEn: 'Started' },
    tillfalleskod: '61128',
    startperiod: { code: 'VT2024', inDigits: '20241' },
    utbildningstillfalleskod: '61128',
    forstaUndervisningsdatum: { date: '2024-03-18', year: 2024, week: 12 },
    sistaUndervisningsdatum: { date: '2024-06-03', year: 2024, week: 23 },
    malgrupp: undefined,
    kortnamn: 'CMATD1 m.fl.',
    urvalskriterier: undefined,
    undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
    undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
    undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
    studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
    studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
    finansieringsform: {
      id: '101050',
      code: 'ORD',
      name: 'Ordinarie anslagsfinansiering',
    },
    minantalplatser: undefined,
    utbildningsplatser: 100,
  },
]

const groupedLadokCourseRounds = [
  {
    term: '20242',
    rounds: [
      {
        uid: 'bab6676e-9a88-11ee-bfe5-0721067a4fbf',
        status: { code: 'S3', nameSv: 'Komplett', nameEn: 'Complete' },
        tillfalleskod: '51505',
        startperiod: { code: 'HT2024', inDigits: '20242' },
        utbildningstillfalleskod: '51505',
        forstaUndervisningsdatum: { date: '2024-08-26', year: 2024, week: 35 },
        sistaUndervisningsdatum: { date: '2024-10-27', year: 2024, week: 43 },
        malgrupp: 'CDEPR1, CENMI1, CLGYM, TEMI2',
        kortnamn: 'CDEPR1 m.fl.',
        urvalskriterier: undefined,
        undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
        undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
        undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
        studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
        studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
        finansieringsform: {
          id: '101050',
          code: 'ORD',
          name: 'Ordinarie anslagsfinansiering',
        },
        minantalplatser: undefined,
        utbildningsplatser: undefined,
      },
      {
        uid: '0772a941-98c8-11ee-888d-8a62d8d3440a',
        status: { code: 'S3', nameSv: 'Komplett', nameEn: 'Complete' },
        tillfalleskod: '50233',
        startperiod: { code: 'HT2024', inDigits: '20242' },
        utbildningstillfalleskod: '50233',
        forstaUndervisningsdatum: { date: '2024-10-28', year: 2024, week: 44 },
        sistaUndervisningsdatum: { date: '2025-01-13', year: 2025, week: 3 },
        malgrupp: undefined,
        kortnamn: 'CMETE1 m.fl.',
        urvalskriterier: undefined,
        undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
        undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
        undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
        studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
        studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
        finansieringsform: {
          id: '101050',
          code: 'ORD',
          name: 'Ordinarie anslagsfinansiering',
        },
        minantalplatser: undefined,
        utbildningsplatser: undefined,
      },
    ],
  },
  {
    term: '20241',
    rounds: [
      {
        uid: '1e16c308-3936-11ef-b4df-74ace29d47e8',
        status: { code: 'S2', nameSv: 'Påbörjad', nameEn: 'Started' },
        tillfalleskod: '61128',
        startperiod: { code: 'VT2024', inDigits: '20241' },
        utbildningstillfalleskod: '61128',
        forstaUndervisningsdatum: { date: '2024-03-18', year: 2024, week: 12 },
        sistaUndervisningsdatum: { date: '2024-06-03', year: 2024, week: 23 },
        malgrupp: undefined,
        kortnamn: 'CMATD1 m.fl.',
        urvalskriterier: undefined,
        undervisningsform: { id: '1', code: 'NML', name: 'Normal' },
        undervisningstid: { id: '101052', code: 'DAG', name: 'Dagtid' },
        undervisningssprak: { id: '1', code: 'SWE', name: 'Svenska' },
        studieort: { id: '135195', code: 'KTHCAMPUS', name: 'KTH Campus' },
        studietakt: { id: '4', code: '50', name: 'Halvfart', takt: 50 },
        finansieringsform: {
          id: '101050',
          code: 'ORD',
          name: 'Ordinarie anslagsfinansiering',
        },
        minantalplatser: undefined,
        utbildningsplatser: 100,
      },
    ],
  },
]

module.exports = {
  ladokCourseRounds,
  groupedLadokCourseRounds,
}
