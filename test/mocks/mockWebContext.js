import { addClientFunctionsToWebContext } from '../../public/js/app/client-context/addClientFunctionsToWebContext'

const storeFunctions = addClientFunctionsToWebContext()
const usedRounds = {
  roundIdList: ['2'],
  roundsIdWithWebVersion: {},
  memoList: [
    {
      courseMemoFileName: 'memo-EF1111HT2019_2.pdf',
      ugKeys: ['EF1111.examiner', 'EF1111.20192.2.courseresponsible'],
      user: 'elenara',
    },
  ],
}
const mockWebContext = (userLang = 'en') => {
  const routerWithData = {
    ...storeFunctions,
    language: 1,
    courseData: { courseCode: 'EF1111', gradeScale: { PF: 'P, F' }, semesterObjectList: {} },
    courseTitle: { name: 'Project in Plasma Physics', credits: '9.0' },
    browserConfig: {
      env: 'dev',
      hostUrl: 'https://localhost:3000',
      port: 3000,
      proxyPrefixPath: { uri: '/kursinfoadmin/pm' },
      storageUri: 'https://kursinfostoragestage/memo-blob-container/',
      useSsl: false,
    },
    usedRounds,
    semesters: ['20211', '20202', '20201', '20192'],
    roundData: {
      20192: [
        {
          endDate: '2019-10-25',
          hasAccess: true,
          ladokUID: 'd',
          language: 'English',
          roundId: '2',
          shortName: '',
          startDate: '2019-08-26',
          targetGroup: [],
        },
        {
          endDate: '2020-01-14',
          hasAccess: true,
          ladokUID: '6413t1tt685',
          language: 'English',
          roundId: '1',
          shortName: '',
          startDate: '2019-10-28',
          targetGroup: [],
        },
      ],
      20201: [
        {
          endDate: '2020-03-14',
          hasAccess: true,
          ladokUID: 'ca29ft7a3',
          language: 'English',
          roundId: '2',
          shortName: '',
          startDate: '2020-01-15',
          targetGroup: [],
        },
        {
          endDate: '2020-06-01',
          hasAccess: true,
          ladokUID: 'c38bc898-f2f4-11e8-9614-d09e533d4323',
          language: 'English',
          roundId: '1',
          shortName: '',
          startDate: '2020-03-16',
          targetGroup: [],
        },
      ],
      20202: [
        {
          endDate: '2020-10-23',
          hasAccess: true,
          ladokUID: '3,f-,',
          language: 'English',
          roundId: '2',
          shortName: '',
          startDate: '2020-08-24',
          targetGroup: [],
        },
        {
          endDate: '2021-01-15',
          hasAccess: true,
          ladokUID: '208f6ed8-36b6-11ea-b8cf-f5b51a134413',
          language: 'English',
          roundId: '1',
          shortName: '',
          startDate: '2020-10-26',
          targetGroup: [],
        },
      ],
      20211: [
        {
          endDate: '2021-03-19',
          hasAccess: true,
          ladokUID: 'c1217dba-3612-11ea-b8cf-f5b51a134413',
          language: 'English',
          roundId: '2',
          shortName: '',
          startDate: '2021-01-18',
          targetGroup: [],
        },
        {
          endDate: '2021-06-08',
          hasAccess: true,
          ladokUID: 'b5ah3989f-36k13',
          language: 'English',
          roundId: '1',
          shortName: '',
          startDate: '2021-03-22',
        },
      ],
    },
    tempData: null,
    statistics: { examinationGrade: 99, endDate: null, registeredStudents: 10 },
    getUsedRounds(semester) {
      return Promise.resolve(usedRounds)
    },
  }

  return routerWithData
}

export default mockWebContext
