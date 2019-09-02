module.exports = {
  shortNames: [ 'en' ],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {

    date_format_short: '%d-%b-%Y',

    error_not_found: 'Sorry, we can\'t find your requested page',
    error_course_not_found: 'Sorry, there is no course with course code ',
    error_generic: 'Something went wrong on the server, please try again later.',
    error_auth: 'You are not authorized to access this page',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Course memo administration',

    lang_block_id: '1.272446',
    locale_text: 'Course information in English',
    site_name: 'Course information',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    },

    header_main: 'Publish course memo',

    /** **** PROGRESS BAR  */
    header_progress_select: '1. Choose course offering',
    header_progress_edit_upload: '2. Upload course memo',
    header_progress_review: '3. Review and publish',

    /** ***** PAGE 1 - ANALYSIS MENU */
    header_choose_course_offering: 'Choose course offering',
    header_select_semester: 'Choose semester',
    select_semester: 'Choose semester',
    header_memo_menu: 'Choose course offering',
    label_start_date: 'Start date',

    /** **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_memo_menu: 'Choose a semester and a course offering for the course memo to be published (step 1 of 3). In the next step (2 of 3), course memo shall be uploaded for the selected semester and course offering. Preview the course memo that is about to be published in the last step (3 of 3). The course memo will then be published on the page Course information.',
    intro_edit: 'In this step (2 of 3) course memo shall be uploaded. If there is already a published course memo it will be replaced. Preview the uploaded course memo before publishing in the next step.',
    intro_preview: 'In this step (3 of 3) a preview of the course memo is presented as it will be published on the page Course information. It is possible to go back to upload another course memo, or to proceed and publish the course memo.',

    intro_new: 'Select one or more administrative course instances that is incouded in the course offering:',
    has_published_memo: ' Has a published course memo', /** FÄRSK SEMLA */
    not_authorized_publish_new: ' You are not course responsible for this instance and cannot select it.',

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
    header_preview: 'Preview', /** FÄRSK SEMLA */
    link_pm: 'Course memo',

    header_rounds: 'Administrative course instances included in the course offering',

    /** ************ ALERTS ************** */
    alert_no_rounds_selected: 'Choose a course offering or administrative course instances below before you click on "Upload".',
    alert_uploaded_file: 'Selected file has been uploaded and been given a new file name',
    alert_not_pdf: 'The specified file could not be uploaded. The file format must be PDF.',
    alert_have_published_memo: 'Any previously published course memo (see course offering below) will be replaced by the new course memo to be uploaded.', /** FÄRSK SEMLA */
    alert_empty_fields: 'NO FILE!!!!',
    /** ************ MODALS ************** */
    info_publish: {
      header: 'To be aware of before publishing!',
	    body: `The information will be published on the page Course information
        <br/> 
        <br/> 
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish'
    },
    info_cancel: {
      header: 'To be aware of before cancelling!',
	    body: 'Unsaved changes will be lost if you cancel the publishing of this course memo <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel'
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Choose semester',
      body: 'Choose what semester the course offering started. If the course offering stretched over several semesters then choose the first semester.'
    },
    info_choose_course_offering: {
      header: 'Choose course offering',
      body: 'Choose all the administrative course instances that is included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering.'
    },
    info_upload_course_memo: {
      header: 'Upload course memo',
      body: 'Upload the latest version of the course memo for the course offering.'
    },

    // PREVIEW PAGE
    header_course_round: 'Kursomgång'
  }
}
