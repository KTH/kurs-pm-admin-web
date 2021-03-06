module.exports = {
  shortNames: ['sv', 'se'],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',

    /**
     * Error messages
     */

    error_bad_request: 'Tyvärr kan eller vill inte servern svara',
    error_not_found: 'Tyvärr kunde vi inte hitta sidan du efterfrågade',
    error_course_not_found: 'Tyvärr så finns det ingen kurs med kurskod ',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Authentication message
     */

    contact_support: 'Kontakta',
    for_questions: 'vid frågor',
    friendly_message_have_not_rights: 'Du saknar behörighet att använda Om kursens administrationsverktyg',
    look_at_list_of_kopps_admin: 'Vill du veta vem som är Kopps-administratör på din skola, se förteckning här:',
    message_have_not_rights: `Du saknar behörighet att använda Om kursens administrationsverktyg. Behörighet ges per automatik till de som är inlagda i KOPPS som examinator, kursansvarig eller lärare för kursen. `,

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Administrera kurs-PM',

    lang_block_id: '1.272446',
    locale_text: 'Denna sida på svenska',

    site_name: 'Administrera Om kursen',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'VT ',
      2: 'HT ',
    },

    header_main: 'Ladda upp alternativt kurs-PM som PDF',
    //* **** PROGRESS BAR  */
    header_progress_select: '1. Välj kursomgång',
    header_progress_edit_upload: '2. Ladda upp kurs-PM',
    header_progress_review: '3. Granska och publicera',

    /** ***** PAGE 1 - ANALYSIS MENU */

    header_select_semester: 'Välj termin',
    select_semester: 'Välj termin',
    header_memo_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',

    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    alert_recommendation: {
      alert_header: 'KTH rekommenderar',
      before_create_memo_link:
        'KTH rekommenderar att du, i stället för att ladda upp ett alternativt kurs-PM, använder funktionen',
      label_create_memo_link: 'Skapa och publicera kurs-PM',
      after_create_memo_link: `där resultatet blir ett kurs-PM som publiceras som en webbsida på en plats dit studenter enkelt hittar och versioner hanteras. Kurs-PM kan därifrån även sparas som PDF. Ytterligare anledningen till rekommendationen är att du får stöd i hur du gör ett bra kurs-pm enligt en mall framtagen på KTH, information från kursplanen hämtas automatiskt in i ditt kurs-PM. Om du ändå väljer att ladda upp ett alternativt kurs-PM som PDF så tänk på att du ansvarar för att dokumentet lever upp till kraven på digital tillgänglighet enligt den internationella standarden WCAG 2.1. Det är också bra om du utgår från samma kurs-PM-mall som hittas på`,
      label_kurs_pm_web_link: 'Kurs-PM',
    },
    intro_memo_menu:
      'Börja med att välja termin och kursomgång för det kurs-PM som ska laddas upp (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna ladda upp kurs-PM som PDF. I sista steget (3 av 3) ges möjlighet att först granska ditt kurs-PM och sedan publicera det på sidan \u201DFörbereda och gå kurs/Kurs-PM\u201D.',
    intro_edit:
      'I detta steg (2 av 3) ska kurs-PM som PDF laddas upp. Finns redan ett publicerat kurs-PM kommer det att skrivas över. I nästa steg finns möjlighet att granska kurs-PM innan publicering.',
    intro_preview:
      'I detta steg (3 av 3) visas hur ditt kurs-PM kommer att se ut på sidan \u201DFörbereda och gå kurs/Kurs-PM\u201D när du har publicerat det. Här finns möjlighet att gå tillbaka för att ladda upp ny fil eller publicera kurs-PM.',

    intro_new: 'Markera ett eller flera kurstillfällen som ingår i kursomgången:',
    has_published_memo:
      ' Ett alternativt kurs-PM som PDF finns publicerat. Du kan välja att ladda upp ett nytt kurs-PM som ersätter det befintliga.' /** FÄRSK SEMLA */,
    has_web_based_memo:
      ' Ett kurs-PM i form av en webbsida finns som utkast eller är publicerat. Gå till Administrera Om kursen för att redigera det.',
    not_authorized_publish_new: 'Du är inte kursansvarig/lärare för detta kurstillfälle och kan därför inte välja det.',
    not_authorized_publish_new_link_label: 'Behörigheter för Om kursen',

    /** ************ BUTTONS ****************** */
    btn_add_memo: 'Ladda upp',
    btn_preview: 'Granska',
    btn_publish: 'Publicera',
    btn_cancel: 'Avbryt',
    btn_back: 'Välj kursomgång',
    btn_back_edit: 'Ladda upp',

    /** ************ PAGE 2 FORM ************** */
    asterix_text: 'Kommer inte att kunna ändras efter publicering',

    header_semester: 'Termin:',
    header_course_offering: 'Kursomgång:',

    header_upload: 'Ladda upp',
    header_upload_file_pm: 'kurs-PM (endast i fil-formatet PDF)',
    header_upload_file_date: 'Publiceringsdatum för kursanalys',
    header_preview: 'Granska' /** FÄRSK SEMLA */,

    link_pm: 'Kurs-PM',

    alert_no_rounds_selected:
      'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knappen "Ladda upp".',
    alert_uploaded_file: 'Vald fil har laddatas upp och fått nytt namn',
    alert_not_pdf:
      'Du måste ladda upp en fil med format PDF (se markering i rött nedan) för att kunna gå vidare till Granska och publicera.',
    alert_have_published_memo:
      'Observera att redan uppladdat kurs-PM som PDF (se kursomgång nedan) kommer att ersättas av kurs-PM som du laddar upp här.' /** FÄRSK SEMLA */,
    alert_empty_fields: 'Du behöver fylla i obligatoriska fält för att gå vidare till Granska och publicera.',
    alert_storage_error:
      'Det gick inte att spara dokumenten på grund av systemfel. Försök igen eller kontakta IT-support.',

    /** ************ MODALS ************** */
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Ditt kurs-PM kommer att laddas upp på sidan \u201DFörbereda och gå kurs/Kurs-PM\u201D.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera',
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta',
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Välj termin',
      body: 'Välj vilken termin kursomgången startade. Om kursomgången sträcker sig över flera terminer; välj kursomgångens starttermin.',
      btnCancel: 'Close',
    },
    info_choose_course_offering: {
      header: 'Välj kursomgång',
      body: 'Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.',
      btnCancel: 'Close',
    },

    info_upload_course_memo: {
      header: 'Ladda upp kurs-PM som PDF',
      body: 'Ladda upp den senaste versionen av kurs-PM för kursomgången som PDF.',
      btnCancel: 'Close',
    },
    info_upload_course_memo_date: {
      header: '????',
      body: '????',
    },

    // PREVIEW PAGE
    header_course_round: 'Kursomgång',
  },
}
