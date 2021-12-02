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

    header_main: 'Ladda upp eller ändra kurs-PM som PDF',
    header_upload_memo: 'Ladda upp kurs-PM',
    //* **** PROGRESS BAR  */
    pagesProgressBar: [
      {
        title: 'Välj kursomgång',
        intro:
          'Börja med att välja termin och kursomgång för det kurs-PM som ska publiceras/ändras (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna ladda upp kurs-PM som PDF. I sista steget (3 av 3) ges möjlighet att först granska ditt kurs-PM och sedan publicera det på sidan \u201DFörbereda och gå kurs/Kurs-PM\u201D. Finns det ett publicerat kurs-PM sedan tidigare kommer ditt kurs-PM versionshanteras.',
      },
      {
        title: 'Ladda upp/ändra kurs-PM',
        intro: '',
      },
      {
        title: 'Granska och publicera',
        intro: '',
      },
    ],
    /** ***** PAGE 1 - ANALYSIS MENU */

    header_select_semester: 'Välj termin',
    select_semester: 'Välj termin',
    header_memo_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',

    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    alert_recommendation: {
      alert_header: 'KTH:s riktlinjer',
      accessability_responsibility:
        'Via denna funktion kan du ladda upp ett kurs-PM som du har skapat utanför systemstödet. Tänk på att du ansvarar för att dokumentet är tillgänglighetsanpassat och att innehållet i ditt kurs-PM följer',
      before_create_memo_link: 'Om du istället använder systemstödet',
      label_create_memo_link: 'Skapa och publicera kurs-PM',
      label_control_info_link: 'Riktlinje om kursplan, betygssystem och examination',
      after_create_memo_link: `kommer ditt kurs-PM att publiceras som en tillgänglighetsanpassad
          webbsida och information från kursplanen hämtas automatiskt till ditt kurs-PM. Du får också stöd med vilka rubriker och information
          som ditt kurs-PM bör innehålla.`,
      label_course_memo_guide_link: 'Läs mer om systemstödet för Kurs-PM',
    },

    intro_new: 'Markera ett eller flera kurstillfällen som ingår i kursomgången:',
    has_published_memo:
      'Ett kurs-PM som PDF finns publicerat sedan tidigare. Du kan välja att ladda upp ett nytt kurs-PM för att publicera en ny version.' /** FÄRSK SEMLA */,
    has_web_based_memo: 'Ett kurs-PM i form av en webbsida finns som utkast eller är publicerat.',
    label_before_link_web_based_memo: 'Gå till',
    label_after_link_web_based_memo: 'för att redigera det.',
    label_link_web_based_draft_memo: 'Skapa och publicera kurs-PM',
    label_link_web_based_published_memo: 'Ändra publicerat kurs-PM',
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

    header_course: 'Kurs',
    header_semester: 'Termin',
    header_course_offering: 'Kursomgång',

    header_upload: 'Ladda upp',
    header_upload_file_pm: 'kurs-PM (endast i fil-formatet PDF)',
    header_upload_file_date: 'Publiceringsdatum för kursanalys',
    header_preview: 'Granska kurs-PM' /** FÄRSK SEMLA */,
    subheader_preview: 'Granska' /** FÄRSK SEMLA */,

    link_pm: 'Kurs-PM',

    alert_no_rounds_selected:
      'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knappen "Ladda upp".',
    alert_uploaded_file: 'Vald fil har laddats upp och fått ett nytt namn.',
    alert_not_pdf:
      'Du måste ladda upp en fil med format PDF (se markering i rött nedan) för att kunna gå vidare till Granska och publicera.',
    alert_have_published_memo:
      'Det finns ett publicerat kurs-PM som PDF sedan tidigare. Om du laddar upp ett nytt kurs-PM kommer det att publiceras som en ny version. Tidigare versioner av kurs-PM visas på sidan Arkiv.',
    alert_empty_fields: 'Du behöver fylla i obligatoriska fält för att gå vidare till Granska och publicera.',
    alert_storage_error:
      'Det gick inte att spara dokumenten på grund av systemfel. Försök igen eller kontakta IT-support.',
    alert_accessability_link_before: 'Tänk på att du behöver',
    alert_accessability_link_after: '(länk till intranätet öppnas i en ny flik).',
    alert_web_memo_support:
      'Att ha kurs-PM som en webbsida är mer tillgängligt än ett publicerat PDF-dokument. Du skapar kurs-PM som en webbsida genom att istället använda systemstödet',
    alert_label_accessability_link: 'tillgänglighetsanpassa din PDF',
    /** ************ MODALS ************** */
    info_publish_new_version: {
      header: 'Att tänka på innan du publicerar!',
      body: `Publicering kommer att ske på sidan: Förbereda/gå kurs (kurs-PM) för vald termin och kursomgång.
        <br/>
        <br/>
        Observera: Ditt uppladdade kurs-PM kommer att publiceras som en ny version.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera',
    },
    info_publish_first_time: {
      header: 'Att tänka på innan du publicerar!',
      body: `Publicering kommer att ske på sidan: Förbereda/gå kurs (kurs-PM) för vald termin och kursomgång.
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
  },
}
