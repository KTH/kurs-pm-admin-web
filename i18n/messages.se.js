module.exports = {
  shortNames: ["sv", "se"],
  longNameSe: "Svenska",
  longNameEn: "Swedish",
  messages: {
    /**
     * General stuff
     */
    date_format_short: "%Y-%m-%d",

    /**
     * Error messages
     */

    error_not_found: "Tyvärr kunde vi inte hitta sidan du efterfrågade",
    error_course_not_found: "Tyvärr så finns det ingen kurs med kurskod ",
    error_generic: "Något gick fel på servern, var god försök igen senare",
    error_auth: "Du har inte behörighet att se sidan.",

    /**
     * Message keys
     */
    service_name: "kurs ",
    title: "Administrera kurs-PM",

    lang_block_id: "1.272446",
    locale_text: "Denna sida på svenska",

    site_name: "Administrera Om kursen",
    host_name: "KTH",
    page_student: "STUDENT PÅ KTH",
    page_course_programme: "KURS- OCH PROGRAMKATALOGEN",

    course_short_semester: {
      1: "VT ",
      2: "HT ",
    },

    header_main: "Ladda upp alternativt kurs-PM som PDF",
    //* **** PROGRESS BAR  */
    header_progress_select: "1. Välj kursomgång",
    header_progress_edit_upload: "2. Ladda upp kurs-PM",
    header_progress_review: "3. Granska och publicera",

    /** ***** PAGE 1 - ANALYSIS MENU */

    header_select_semester: "Välj termin",
    select_semester: "Välj termin",
    header_memo_menu: "Välj kursomgång",
    label_start_date: "Startdatum",

    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    alert_recommendation: {
      alert_header: "KTH rekommenderar",
      before_create_memo_link:
        "KTH rekommenderar att du, i stället för att ladda upp ett alternativt kurs-PM, använder funktionen",
      label_create_memo_link: "Skapa och publicera kurs-PM",
      after_create_memo_link: `där resultatet blir ett kurs-PM som publiceras som en webbsida på en plats dit studenter enkelt hittar och versioner hanteras. Kurs-PM kan därifrån även sparas som PDF. Ytterligare anledningen till rekommendationen är att du får stöd i hur du gör ett bra kurs-pm enligt en mall framtagen på KTH, information från kursplanen hämtas automatiskt in i ditt kurs-PM. Om du ändå väljer att ladda upp ett alternativt kurs-PM som PDF så tänk på att du ansvarar för att dokumentet lever upp till kraven på digital tillgänglighet enligt den internationella standarden WCAG 2.1. Det är också bra om du utgår från samma kurs-PM-mall som hittas på`,
      label_kurs_pm_web_link: "Kurs-PM",
    },
    intro_memo_menu:
      "Börja med att välja termin och kursomgång för det kurs-PM som ska laddas upp (steg 1 av 3). I nästa steg (2 av 3) kommer du att kunna ladda upp kurs-PM som PDF. I sista steget (3 av 3) ges möjlighet att först granska kurs-PM och sedan publicera det på sidan Kursinformation för vald termin och kursomgång.",
    intro_edit:
      "I detta steg (2 av 3) ska kurs-PM som PDF laddas upp. Finns redan ett publicerat kurs-PM kommer det att skrivas över. I nästa steg finns möjlighet att granska kurs-PM innan publicering.",
    intro_preview:
      "I detta steg (3 av 3) visas hur kurs-PM kommer att se ut på sidan Kursinformation för vald termin och kursomgång. Här finns möjlighet att gå tillbaka för att ladda upp ny fil eller publicera kurs-PM.",

    intro_new:
      "Markera ett eller flera kurstillfällen som ingår i kursomgången:",
    has_published_memo: " Finns uppladdat kurs-PM som PDF" /** FÄRSK SEMLA */,
    has_web_based_memo:
      " Detta kurstillfälle har ett publicerat kurs-PM i form av webbsida och kan därför inte väljas.",
    not_authorized_publish_new:
      " Du är inte kursansvarig för detta kurstillfälle och kan därför inte välja det.",

    /** ************ BUTTONS ****************** */
    btn_add_memo: "Ladda upp",
    btn_preview: "Granska",
    btn_publish: "Publicera",
    btn_cancel: "Avbryt",
    btn_back: "Välj kursomgång",
    btn_back_edit: "Ladda upp",

    /** ************ PAGE 2 FORM ************** */
    asterix_text: "Kommer inte att kunna ändras efter publicering",

    header_semester: "Termin:",
    header_course_offering: "Kursomgång:",

    header_upload: "Ladda upp",
    header_upload_file_pm: "kurs-PM (endast i fil-formatet PDF)",
    header_upload_file_date: "Publiceringsdatum för kursanalys",
    header_preview: "Granska" /** FÄRSK SEMLA */,

    link_pm: "Kurs-PM",

    alert_no_rounds_selected:
      'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knappen "Ladda upp".',
    alert_uploaded_file: "Vald fil har laddatas upp och fått nytt namn",
    alert_not_pdf:
      "Du måste ladda upp en fil med format PDF (se markering i rött nedan) för att kunna gå vidare till Granska och publicera.",
    alert_have_published_memo:
      "Observera att redan uppladdat kurs-PM som PDF (se kursomgång nedan) kommer att ersättas av kurs-PM som du laddar upp här." /** FÄRSK SEMLA */,
    alert_empty_fields:
      "Du behöver fylla i obligatoriska fält för att gå vidare till Granska och publicera.",
    /** ************ MODALS ************** */
    info_publish: {
      header: "Att tänka på innan du publicerar!",
      body: `Kurs-PM kommer att laddas upp på sidan Inför kursval.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: "Nej, gå tillbaka",
      btnConfirm: "Ja, fortsätt publicera",
    },
    info_cancel: {
      header: "Att tänka på innan du avbryter!",
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: "Nej, gå tillbaka",
      btnConfirm: "Ja, fortsätt avbryta",
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: "Välj termin",
      body:
        "Välj vilken termin kursomgången startade. Om kursomgången sträcker sig över flera terminer; välj kursomgångens starttermin.",
      btnCancel: "Close",
    },
    info_choose_course_offering: {
      header: "Välj kursomgång",
      body:
        "Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.",
      btnCancel: "Close",
    },

    info_upload_course_memo: {
      header: "Ladda upp kurs-PM som PDF",
      body:
        "Ladda upp den senaste versionen av kurs-PM för kursomgången som PDF.",
      btnCancel: "Close",
    },
    info_upload_course_memo_date: {
      header: "????",
      body: "????",
    },

    // PREVIEW PAGE
    header_course_round: "Kursomgång",
  },
};
