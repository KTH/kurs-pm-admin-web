module.exports = {
  shortNames: [ 'sv', 'se' ],
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

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du efterfrågade',
    error_course_not_found: 'Tyvärr så finns det ingen kurs med kurskod ',
    error_generic: 'Något gick fel på servern, var god försök igen senare',
    error_auth: 'Du har inte behörighet att se sidan.',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Administrera kurs-pm',

    lang_block_id: '1.272446',
    locale_text: 'Administrera kurs-pm på svenska',

    site_name: 'Kurs-pm Admin',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    },

    header_main: {
      new: 'Publicera kurs-pm'
    },
    //* **** PROGRESS BAR  */
    header_progress_select: '1. Välj kursomgång',
    header_progress_edit_upload: '2. Ladda upp kurs-pm',
    header_progress_review: '3. Granska och publicera',

    /** ***** PAGE 1 - ANALYSIS MENU */

    header_select_semester: 'Välj termin',
    select_semester: 'Välj termin',
    header_memo_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',

    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_memo_menu: 'Börja med att välja termin och kursomgång för det kurs-pm som ska publiceras (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna ladda upp kurs-pm. I sista steget (3 av 3) ges möjlighet att först granska kurs-pm och sedan publicera det på sidan Kursinformation för vald termin och kursomgång.',
    intro_edit: 'I detta steg (2 av 3) ska kurs-pm laddas upp. Finns redan ett publicerat kurs-pm kommer det att skrivas över. I nästa steg finns möjlighet att granska kurs-pm innan publicering.',
    intro_preview: 'I detta steg (3 av 3) visas hur kurs-pm kommer att se ut på sidan Kursinformation för vald termin och kursomgång. Här finns möjlighet att gå tillbaka för att ladda upp ny fil eller publicera kurs-pm.',

    intro_new: 'Markera ett eller flera kurstillfällen som ingår i kursomgången:',
    has_published_memo: ' Finns publicerat kurs-pm', /** FÄRSK SEMLA */
    not_authorized_publish_new: ' Du är inte kursansvarig för detta kurstillfälle och kan därför inte välja det.',

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
    header_upload_file_pm: 'Kurs-pm (endast i fil-formatet PDF)',
    header_upload_file_date: 'Publiceringsdatum för kursanalys',
    header_preview: 'Granska', /** FÄRSK SEMLA */

    link_pm: 'Kurs-PM',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knappen "Ladda upp".',
    alert_uploaded_file: 'Vald fil har laddatas upp och fått nytt namn',
    alert_not_pdf: 'Du måste ladda upp en fil med format PDF (se markering i rött nedan) för att kunna gå vidare till Granska och publicera.',
    alert_have_published_memo: 'Observera att kurs-pm som finns publicerat (se kursomgång nedan) kommer att ersättas av kurs-pm som du laddar upp här.', /** FÄRSK SEMLA */

    /** ************ MODALS ************** */
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Publicering kommer att ske på sidan Kursinformation.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera'
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta'
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Välj termin',
      body: 'Välj vilken termin kursomgången startade. Om kursomgången sträcker sig över flera terminer; välj kursomgångens starttermin.',
      btnCancel: 'Close'
    },
    info_choose_course_offering: {
      header: 'Välj kursomgång',
      body: 'Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.',
      btnCancel: 'Close'
    },

    info_upload_course_memo: {
      header: 'Ladda upp kurs-pm',
      body: 'Ladda upp den senaste versionen av kurs-pm för kursomgången.',
      btnCancel: 'Close'
    },
    info_upload_course_memo_date: {
      header: '????',
      body: '????'
    },

    // PREVIEW PAGE
    header_course_round: 'Kursomgång'
  }
}
