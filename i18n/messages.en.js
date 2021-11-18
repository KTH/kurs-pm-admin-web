module.exports = {
  shortNames: ['en'],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    date_format_short: '%d-%b-%Y',

    error_bad_request: 'Sorry, the server cannot or will not process the request',
    error_not_found: "Sorry, we can't find your requested page",
    error_course_not_found: 'Sorry, there is no course with course code ',
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Course memo administration',

    lang_block_id: '1.272446',
    locale_text: 'This page in English',
    site_name: 'Administer About course',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn ',
    },

    header_main: 'Upload alternative course memo as PDF',

    /**
     * Authentication message
     */

    contact_support: 'Contact',
    for_questions: 'for questions',
    friendly_message_have_not_rights: 'Missing permission to use About the course administration tool.',
    look_at_list_of_kopps_admin:
      'If you want to know who is the Kopps administrator at your school, look at the list here:',
    message_have_not_rights: `Missing permission to use About the course administration tool. Permission is automatically granted to those who are registered in KOPPS as an examiner, course coordinator or teacher for the course.`,

    /** **** PROGRESS BAR  */
    pagesProgressBar: [
      {
        title: 'Choose course offering',
        intro:
          'Start by selecting the semester and course offering for the course memo to be uploaded (step 1 of 3). Then, in the next step (2 out of 3), you will upload the course memo as a PDF. Finally, in the last step (3 out of 3), you will review your course memo and publish it on \u201CPrepare and take course/Course memo\u201D. If there is a previously published course PM, your course memo will be published as a new version.',
      },
      {
        title: 'Upload course memo',
        intro:
          'In this step (2 of 3) course memo as PDF shall be uploaded. If there is already a published course memo it will be replaced. Preview the uploaded course memo before publishing in the next step.',
      },
      {
        title: 'Review and publish',
        intro:
          'This step (3 out of 3) shows you what your course memo will look like on \u201CPrepare and take course/Course memo\u201D after publishing it. It is possible to go back to upload another course memo, or to proceed and publish the course memo.',
      },
    ],

    /** ***** PAGE 1 - ANALYSIS MENU */
    header_choose_course_offering: 'Choose course offering',
    header_select_semester: 'Choose semester',
    select_semester: 'Choose semester',
    header_memo_menu: 'Choose course offering',
    label_start_date: 'Start date',

    /** **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    alert_recommendation: {
      alert_header: 'KTH’s guidelines',
      accessability_responsibility:
        'Here you can upload a course memo created outside the system support. Keep in mind that you are responsible for ensuring that the document meets the requirements for digital accessibility in accordance with the international standard WCAG 2.1, and that the content of your course memo follows the',
      before_create_memo_link: 'If you use the system support',
      label_create_memo_link: 'Create and publish course memo',
      label_control_info_link: 'Guideline on course syllabus, grading system and examination',
      after_create_memo_link: `instead of uploading a PDF, your course memo will automatically fulfill web accessibility guidelines and information from the course syllabus will be downloaded to the course memo. You also get support with which headings and information your course memo should contain.`,
      label_course_memo_guide_link: 'Read more about the system support for course memo',
    },
    intro_new: 'Select one or more administrative course instances that is included in the course offering:',
    has_published_memo:
      'There is a previously published course memo as PDF. You can upload a new course memo to publish a new version.' /** FÄRSK SEMLA */,
    has_web_based_memo: 'This administrative course instance has a draft or a published course memo.',
    label_before_link_web_based_memo: 'Go to',
    label_after_link_web_based_memo: 'to change it.',
    label_link_web_based_draft_memo: 'Create and publish course memo',
    label_link_web_based_published_memo: 'Edit published course memo',
    not_authorized_publish_new: ' You are not course coordinator/teacher for this instance and cannot select it.',
    not_authorized_publish_new_link_label: 'Permissions for About course',

    /** ************ BUTTONS ****************** */
    btn_add_memo: 'Upload',
    btn_preview: 'Preview ',
    btn_publish: 'Publish',
    btn_cancel: 'Cancel',
    btn_back: 'Choose course offering',
    btn_back_edit: 'Edit, upload',

    /** ************ PAGE 2 FORM ************** */
    header_semester: 'Semester: ',
    header_course_offering: 'Course offering:',
    header_upload: 'Upload',
    header_upload_file_pm: 'Course memo (only as PDF file format)',
    header_upload_file_date: 'Publish date of course analysis *',
    header_preview: 'Preview' /** FÄRSK SEMLA */,
    link_pm: 'Course memo',

    header_rounds: 'Administrative course instances included in the course offering',

    /** ************ ALERTS ************** */
    alert_no_rounds_selected:
      'Choose a course offering or administrative course instances below before you click on "Upload".',
    alert_uploaded_file: 'The selected file has been uploaded and given a new file name.',
    alert_not_pdf: 'The specified file could not be uploaded. The file format must be PDF.',
    alert_have_published_memo:
      'Please note that there is a previously published course memo as PDF. If you upload a new course memo it will be published as a new version. Previous versions of course memos are to be found on the Archive page.',
    alert_empty_fields: 'All mandatory fields must contain information before proceeding to Preview and publish.',
    alert_storage_error:
      'Failed to save the docuemnt you chose, due to technical issues mightly. Try again later and contact IT Support if the problem remains.',
    alert_accessability_link_before: 'Keep in mind that you need to',
    alert_accessability_link_after:
      ' (link to the intranet opens in a new tab). Having a course memo as a web page is more accessible than a published PDF. You create a course memo as a web page by instead using the system support',
    alert_label_accessability_link: 'customize the accessibility of your PDF',

    /** ************ MODALS ************** */
    info_publish_new_version: {
      header: 'To be aware of before publishing!',
      body: `Your course memo will be uploaded to: \u201CPrepare and take course/Course memo\u201D for selected semester and course offerings.
        <br/>
        <br/>  
        Please note: The uploaded course memo will be published as a new version.
        <br/>
        <br/>  
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish',
    },
    info_publish_first_time: {
      header: 'To be aware of before publishing!',
      body: `Your course memo will be uploaded to: \u201CPrepare and take course/Course memo\u201D for selected semester and course offerings.
        <br/> 
        <br/> 
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish',
    },
    info_cancel: {
      header: 'To be aware of before cancelling!',
      body: 'Unsaved changes will be lost if you cancel the publishing of this course memo <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel',
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Choose semester',
      body: 'Choose what semester the course offering started. If the course offering stretched over several semesters then choose the first semester.',
    },
    info_choose_course_offering: {
      header: 'Choose course offering',
      body: 'Choose all the administrative course instances that is included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering.',
    },
    info_upload_course_memo: {
      header: 'Upload course memo as PDF',
      body: 'Upload the latest version of the course memo for the course offering as PDF.',
    },
  },
}
