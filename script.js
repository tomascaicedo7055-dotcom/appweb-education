/* =========================================================
   EDUHEALTH
   Explorador educativo de síntomas
   =========================================================

   IMPORTANTE:
   Este sistema NO realiza diagnósticos médicos.

   Su objetivo es:
   1. Identificar síntomas descritos por el usuario.
   2. Relacionarlos con patrones educativos.
   3. Hacer preguntas de seguimiento.
   4. Mostrar coincidencias explicadas.
   5. Detectar señales de alarma.

   ========================================================= */


/* =========================================================
   1. CONFIGURACIÓN
========================================================= */

const CONFIG = {
    maxResults: 5,
    minimumScore: 28,
    strongMatch: 70,
    mediumMatch: 48,
    questionLimit: 6,
    analysisDelay: 850
};


/* =========================================================
   2. ESTADO DE LA APLICACIÓN
========================================================= */

const state = {

    selectedSymptoms: [],

    detectedSymptoms: [],

    userText: "",

    followUpQuestions: [],

    answers: {},

    preliminaryResults: [],

    finalResults: [],

    emergencyFlags: [],

    analysisStarted: false,

    analysisFinished: false
};


/* =========================================================
   3. ELEMENTOS DEL DOM
========================================================= */

const elements = {

    symptomInput: document.getElementById("symptomInput"),

    symptomSuggestions:
        document.getElementById("symptomSuggestions"),

    selectedSymptoms:
        document.getElementById("selectedSymptoms"),

    selectedSymptomsCount:
        document.getElementById("selectedSymptomsCount"),

    emptySymptomsMessage:
        document.getElementById("emptySymptomsMessage"),

    analyzeButton:
        document.getElementById("analyzeButton"),

    clearSearch:
        document.getElementById("clearSearch"),

    clearSymptoms:
        document.getElementById("clearSymptoms"),

    heroSymptomCount:
        document.getElementById("heroSymptomCount"),

    analysisLoading:
        document.getElementById("analysisLoading"),

    analysisProgressBar:
        document.getElementById("analysisProgressBar"),

    analysisProgressText:
        document.getElementById("analysisProgressText"),

    loadingMessage:
        document.getElementById("loadingMessage"),

    results:
        document.getElementById("results"),

    resultsContainer:
        document.getElementById("resultsContainer"),

    resultSymptoms:
        document.getElementById("resultSymptoms"),

    resultStatus:
        document.getElementById("resultStatus"),

    noResults:
        document.getElementById("noResults"),

    warningPanel:
        document.getElementById("warningPanel"),

    warningList:
        document.getElementById("warningList"),

    newAnalysisButton:
        document.getElementById("newAnalysisButton"),

    tryAgainButton:
        document.getElementById("tryAgainButton"),

    scrollTopButton:
        document.getElementById("scrollTopButton"),

    themeToggle:
        document.getElementById("themeToggle"),

    mobileMenuButton:
        document.getElementById("mobileMenuButton"),

    mainNavigation:
        document.getElementById("mainNavigation"),

    appLoader:
        document.getElementById("appLoader"),

    toastContainer:
        document.getElementById("toastContainer"),

    informationModal:
        document.getElementById("informationModal"),

    closeModal:
        document.getElementById("closeModal"),

    modalConfirm:
        document.getElementById("modalConfirm"),

    modalTitle:
        document.getElementById("modalTitle"),

    modalContent:
        document.getElementById("modalContent")
};


/* =========================================================
   4. NORMALIZACIÓN DE TEXTO
========================================================= */

function normalizeText(text) {

    if (!text) return "";

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   5. BASE DE SÍNTOMAS
========================================================= */

const SYMPTOMS = {

    fiebre: {
        label: "Fiebre",

        synonyms: [
            "fiebre",
            "temperatura",
            "temperatura alta",
            "calentura",
            "estoy caliente",
            "tengo fiebre"
        ],

        category: "general"
    },

    escalofrios: {
        label: "Escalofríos",

        synonyms: [
            "escalofrios",
            "temblores",
            "tiritar",
            "tiritando",
            "frio con temblor"
        ],

        category: "general"
    },

    tos: {
        label: "Tos",

        synonyms: [
            "tos",
            "toser",
            "estoy tosiendo",
            "tengo tos"
        ],

        category: "respiratorio"
    },

    tos_seca: {
        label: "Tos seca",

        synonyms: [
            "tos seca",
            "tos sin flema",
            "tos irritativa",
            "tos irritada"
        ],

        category: "respiratorio"
    },

    tos_con_flema: {
        label: "Tos con flema",

        synonyms: [
            "tos con flema",
            "tos con mucosidad",
            "tos con moco",
            "saco flema",
            "expulso flema"
        ],

        category: "respiratorio"
    },

    dolor_garganta: {
        label: "Dolor de garganta",

        synonyms: [
            "dolor de garganta",
            "me duele la garganta",
            "garganta dolorida",
            "ardor de garganta",
            "molestia en la garganta",
            "garganta irritada"
        ],

        category: "respiratorio"
    },

    congestion_nasal: {
        label: "Congestión nasal",

        synonyms: [
            "congestion nasal",
            "nariz tapada",
            "nariz congestionada",
            "no puedo respirar por la nariz",
            "nariz bloqueada"
        ],

        category: "respiratorio"
    },

    secrecion_nasal: {
        label: "Secreción nasal",

        synonyms: [
            "secrecion nasal",
            "mocos",
            "moqueo",
            "nariz que gotea",
            "goteo nasal",
            "mucha mucosidad"
        ],

        category: "respiratorio"
    },

    estornudos: {
        label: "Estornudos",

        synonyms: [
            "estornudos",
            "estornudo mucho",
            "estoy estornudando"
        ],

        category: "respiratorio"
    },

    dificultad_respirar: {
        label: "Dificultad para respirar",

        synonyms: [
            "dificultad para respirar",
            "me cuesta respirar",
            "me falta el aire",
            "falta de aire",
            "no puedo respirar bien",
            "me ahogo",
            "respiracion dificil"
        ],

        category: "respiratorio",

        emergency: true
    },

    sibilancias: {
        label: "Silbidos al respirar",

        synonyms: [
            "silbido al respirar",
            "silbidos al respirar",
            "sibilancias",
            "pitido al respirar",
            "ruido al respirar"
        ],

        category: "respiratorio"
    },

    dolor_cabeza: {
        label: "Dolor de cabeza",

        synonyms: [
            "dolor de cabeza",
            "me duele la cabeza",
            "cefalea",
            "dolor en la cabeza"
        ],

        category: "neurologico"
    },

    migraña: {
        label: "Dolor de cabeza intenso",

        synonyms: [
            "migraña",
            "migrana",
            "dolor pulsante",
            "dolor palpitante",
            "dolor fuerte de cabeza"
        ],

        category: "neurologico"
    },

    mareo: {
        label: "Mareo",

        synonyms: [
            "mareo",
            "me mareo",
            "estoy mareado",
            "sensacion de mareo",
            "inestabilidad"
        ],

        category: "neurologico"
    },

    desmayo: {
        label: "Desmayo",

        synonyms: [
            "desmayo",
            "me desmaye",
            "perdi el conocimiento",
            "me desvaneci",
            "me fui al piso"
        ],

        category: "neurologico",

        emergency: true
    },

    confusion: {
        label: "Confusión",

        synonyms: [
            "confusion",
            "estoy confundido",
            "desorientacion",
            "no se donde estoy",
            "no pienso con claridad"
        ],

        category: "neurologico",

        emergency: true
    },

    debilidad: {
        label: "Debilidad",

        synonyms: [
            "debilidad",
            "me siento debil",
            "sin fuerzas",
            "falta de fuerzas",
            "agotamiento fisico"
        ],

        category: "general"
    },

    cansancio: {
        label: "Cansancio",

        synonyms: [
            "cansancio",
            "cansado",
            "fatiga",
            "fatigado",
            "agotamiento",
            "sin energia",
            "no tengo energia"
        ],

        category: "general"
    },

    dolor_muscular: {
        label: "Dolor muscular",

        synonyms: [
            "dolor muscular",
            "dolores musculares",
            "me duelen los musculos",
            "dolor de cuerpo",
            "me duele todo el cuerpo",
            "dolor corporal"
        ],

        category: "general"
    },

    dolor_articular: {
        label: "Dolor articular",

        synonyms: [
            "dolor articular",
            "me duelen las articulaciones",
            "dolor de articulaciones",
            "dolor en las articulaciones"
        ],

        category: "general"
    },

    nauseas: {
        label: "Náuseas",

        synonyms: [
            "nauseas",
            "nausea",
            "ganas de vomitar",
            "me dan ganas de vomitar"
        ],

        category: "digestivo"
    },

    vomitos: {
        label: "Vómitos",

        synonyms: [
            "vomito",
            "vomitos",
            "he vomitado",
            "estoy vomitando",
            "devolver"
        ],

        category: "digestivo"
    },

    diarrea: {
        label: "Diarrea",

        synonyms: [
            "diarrea",
            "evacuaciones liquidas",
            "heces liquidas",
            "deposiciones liquidas"
        ],

        category: "digestivo"
    },

    dolor_abdominal: {
        label: "Dolor abdominal",

        synonyms: [
            "dolor abdominal",
            "dolor de estomago",
            "me duele el estomago",
            "dolor de barriga",
            "dolor de vientre",
            "dolor abdominal"
        ],

        category: "digestivo"
    },

    perdida_apetito: {
        label: "Pérdida de apetito",

        synonyms: [
            "no tengo apetito",
            "perdi el apetito",
            "no quiero comer",
            "falta de apetito"
        ],

        category: "digestivo"
    },

    sed_excesiva: {
        label: "Sed excesiva",

        synonyms: [
            "mucha sed",
            "sed excesiva",
            "tengo demasiada sed",
            "sed constante"
        ],

        category: "hidratacion"
    },

    boca_seca: {
        label: "Boca seca",

        synonyms: [
            "boca seca",
            "tengo la boca seca",
            "labios secos",
            "boca pegajosa"
        ],

        category: "hidratacion"
    },

    orina_oscura: {
        label: "Orina oscura",

        synonyms: [
            "orina oscura",
            "orino oscuro",
            "orina amarilla oscura",
            "orina muy amarilla"
        ],

        category: "hidratacion"
    },

    poca_orina: {
        label: "Menor cantidad de orina",

        synonyms: [
            "orino poco",
            "orino menos",
            "he orinado poco",
            "poca orina",
            "casi no orino"
        ],

        category: "hidratacion"
    },

    dolor_pecho: {
        label: "Dolor o presión en el pecho",

        synonyms: [
            "dolor de pecho",
            "dolor en el pecho",
            "presion en el pecho",
            "opresion en el pecho",
            "me duele el pecho"
        ],

        category: "cardiopulmonar",

        emergency: true
    },

    palpitaciones: {
        label: "Palpitaciones",

        synonyms: [
            "palpitaciones",
            "corazon acelerado",
            "latidos rapidos",
            "siento el corazon",
            "latidos fuertes"
        ],

        category: "cardiopulmonar"
    },

    dolor_dental: {
        label: "Dolor dental",

        synonyms: [
            "dolor de muela",
            "dolor dental",
            "me duele una muela",
            "me duele un diente",
            "dolor de dientes"
        ],

        category: "dental"
    },

    sensibilidad_dental: {
        label: "Sensibilidad dental",

        synonyms: [
            "sensibilidad dental",
            "me duelen los dientes con frio",
            "dolor al tomar frio",
            "dolor al tomar caliente",
            "dientes sensibles"
        ],

        category: "dental"
    },

    dolor_piel: {
        label: "Molestia en la piel",

        synonyms: [
            "me duele la piel",
            "piel sensible",
            "molestia en la piel"
        ],

        category: "piel"
    },

    picazon: {
        label: "Picazón",

        synonyms: [
            "picazon",
            "comezon",
            "me pica",
            "prurito"
        ],

        category: "piel"
    },

    erupcion: {
        label: "Erupción o sarpullido",

        synonyms: [
            "sarpullido",
            "erupcion",
            "manchas en la piel",
            "granitos en la piel",
            "ronchas"
        ],

        category: "piel"
    },

    ojos_rojos: {
        label: "Ojos rojos o irritados",

        synonyms: [
            "ojos rojos",
            "ojos irritados",
            "ojo rojo",
            "me arden los ojos"
        ],

        category: "ocular"
    },

    ojos_llorosos: {
        label: "Ojos llorosos",

        synonyms: [
            "ojos llorosos",
            "lagrimeo",
            "me lloran los ojos",
            "lagrimeo constante"
        ],

        category: "ocular"
    },

    dificultad_dormir: {
        label: "Dificultad para dormir",

        synonyms: [
            "no puedo dormir",
            "dificultad para dormir",
            "insomnio",
            "duermo mal",
            "me cuesta dormir"
        ],

        category: "sueño"
    },

    sueño_no_reparador: {
        label: "Sueño poco reparador",

        synonyms: [
            "no descanso al dormir",
            "me levanto cansado",
            "duermo pero sigo cansado",
            "sueño poco reparador"
        ],

        category: "sueño"
    },

    estres: {
        label: "Estrés",

        synonyms: [
            "estres",
            "estress",
            "mucho estres",
            "estoy estresado",
            "estresado"
        ],

        category: "emocional"
    },

    ansiedad: {
        label: "Ansiedad",

        synonyms: [
            "ansiedad",
            "ansioso",
            "me siento ansioso",
            "nervios",
            "nerviosismo"
        ],

        category: "emocional"
    }
};


/* =========================================================
   6. BASE DE PATRONES EDUCATIVOS
========================================================= */

const CONDITIONS = [

    {
        id: "resfriado",

        name: "Patrón compatible con resfriado común",

        category: "Respiratorio",

        description:
            "La combinación de síntomas nasales y de garganta con tos puede aparecer en cuadros respiratorios altos como el resfriado común.",

        symptoms: {
            congestion_nasal: 18,
            secrecion_nasal: 18,
            estornudos: 16,
            dolor_garganta: 15,
            tos: 14,
            dolor_cabeza: 8,
            tos_seca: 7,
            cansancio: 5
        },

        characteristic: [
            "congestion_nasal",
            "secrecion_nasal",
            "estornudos"
        ],

        questions: [
            "respiratory",
            "onset"
        ],

        advice:
            "Observa la evolución de los síntomas y presta atención a dificultad respiratoria, fiebre persistente o empeoramiento."
    },


    {
        id: "influenza_like",

        name: "Patrón compatible con cuadro gripal",

        category: "Respiratorio / general",

        description:
            "La fiebre, los dolores corporales, la fatiga y la tos pueden formar un patrón compatible con una enfermedad tipo influenza.",

        symptoms: {
            fiebre: 24,
            escalofrios: 15,
            dolor_muscular: 18,
            cansancio: 16,
            tos: 13,
            dolor_cabeza: 10,
            dolor_garganta: 8,
            secrecion_nasal: 5,
            congestion_nasal: 4,
            nauseas: 3,
            vomitos: 3
        },

        characteristic: [
            "fiebre",
            "dolor_muscular",
            "cansancio",
            "escalofrios"
        ],

        questions: [
            "onset",
            "fever"
        ],

        advice:
            "La aparición repentina de fiebre, dolores musculares y fatiga puede ser relevante. Consulta si los síntomas son intensos o empeoran."
    },


    {
        id: "allergic_rhinitis",

        name: "Patrón compatible con rinitis alérgica",

        category: "Respiratorio / alérgico",

        description:
            "Estornudos repetidos, congestión, secreción nasal y ojos llorosos pueden aparecer juntos en cuadros alérgicos.",

        symptoms: {
            estornudos: 25,
            secrecion_nasal: 22,
            congestion_nasal: 18,
            ojos_llorosos: 18,
            picazon: 12,
            ojos_rojos: 10,
            dolor_garganta: 3
        },

        characteristic: [
            "estornudos",
            "ojos_llorosos",
            "picazon"
        ],

        questions: [
            "allergy"
        ],

        advice:
            "Observa si los síntomas aparecen al estar expuesto a polvo, polen, animales u otros desencadenantes."
    },


    {
        id: "gastroenteritis_like",

        name: "Patrón compatible con cuadro gastrointestinal",

        category: "Digestivo",

        description:
            "La combinación de náuseas, vómitos, diarrea y dolor abdominal puede corresponder a un patrón gastrointestinal.",

        symptoms: {
            nauseas: 20,
            vomitos: 24,
            diarrea: 24,
            dolor_abdominal: 18,
            perdida_apetito: 8,
            fiebre: 6,
            debilidad: 5
        },

        characteristic: [
            "diarrea",
            "vomitos",
            "dolor_abdominal"
        ],

        questions: [
            "gastro",
            "hydration"
        ],

        advice:
            "La hidratación es importante cuando hay vómitos o diarrea. Vigila especialmente la disminución marcada de la orina, mareos o confusión."
    },


    {
        id: "dehydration",

        name: "Posible patrón de deshidratación",

        category: "Hidratación",

        description:
            "Sed intensa, boca seca, orina oscura o escasa y mareos pueden aparecer cuando el organismo ha perdido más líquidos de los que repone.",

        symptoms: {
            sed_excesiva: 25,
            boca_seca: 20,
            orina_oscura: 22,
            poca_orina: 25,
            mareo: 15,
            cansancio: 8,
            dolor_cabeza: 6,
            vomitos: 6,
            diarrea: 8
        },

        characteristic: [
            "poca_orina",
            "orina_oscura",
            "sed_excesiva"
        ],

        questions: [
            "hydration"
        ],

        advice:
            "Si existe pérdida importante de líquidos, presta especial atención a la cantidad de orina, mareos y cambios en el estado mental."
    },


    {
        id: "tension_headache",

        name: "Patrón compatible con cefalea tensional",

        category: "Neurológico",

        description:
            "Un dolor de cabeza asociado a tensión, estrés, cansancio o falta de sueño puede presentar un patrón compatible con cefalea tensional.",

        symptoms: {
            dolor_cabeza: 25,
            estres: 15,
            dificultad_dormir: 12,
            sueño_no_reparador: 12,
            cansancio: 10,
            dolor_muscular: 8,
            ansiedad: 7
        },

        characteristic: [
            "dolor_cabeza",
            "estres",
            "dificultad_dormir"
        ],

        questions: [
            "headache"
        ],

        advice:
            "Si el dolor aparece de forma súbita y extremadamente intensa, o se acompaña de síntomas neurológicos, requiere valoración urgente."
    },


    {
        id: "migraine_like",

        name: "Patrón compatible con migraña",

        category: "Neurológico",

        description:
            "Algunos dolores de cabeza intensos pueden acompañarse de náuseas y sensibilidad a determinados estímulos.",

        symptoms: {
            migraña: 30,
            dolor_cabeza: 18,
            nauseas: 15,
            ojos_llorosos: 3
        },

        characteristic: [
            "migraña",
            "nauseas"
        ],

        questions: [
            "headache"
        ],

        advice:
            "Un dolor de cabeza nuevo, súbito o muy intenso, especialmente acompañado de alteraciones neurológicas, requiere valoración médica."
    },


    {
        id: "sleep_deprivation",

        name: "Patrón compatible con falta de sueño",

        category: "Sueño",

        description:
            "Dormir poco o tener un sueño poco reparador puede relacionarse con cansancio, dificultad de concentración, irritabilidad y dolor de cabeza.",

        symptoms: {
            dificultad_dormir: 25,
            sueño_no_reparador: 25,
            cansancio: 20,
            dolor_cabeza: 12,
            estres: 10,
            ansiedad: 8
        },

        characteristic: [
            "dificultad_dormir",
            "sueño_no_reparador",
            "cansancio"
        ],

        questions: [
            "sleep"
        ],

        advice:
            "Si los problemas de sueño son persistentes o afectan significativamente tu funcionamiento diario, conviene comentarlos con un profesional."
    },


    {
        id: "stress_related",

        name: "Patrón relacionado con estrés",

        category: "Bienestar emocional",

        description:
            "El estrés puede acompañarse de tensión, dificultad para dormir, cansancio, ansiedad y algunas molestias físicas.",

        symptoms: {
            estres: 25,
            ansiedad: 18,
            dificultad_dormir: 15,
            cansancio: 14,
            dolor_cabeza: 10,
            palpitaciones: 8,
            dolor_muscular: 7
        },

        characteristic: [
            "estres",
            "ansiedad",
            "dificultad_dormir"
        ],

        questions: [
            "stress"
        ],

        advice:
            "Si el malestar emocional es intenso, persistente o interfiere con tu vida diaria, busca apoyo profesional."
    },


    {
        id: "dental",

        name: "Patrón relacionado con molestias dentales",

        category: "Salud bucal",

        description:
            "Dolor localizado en un diente o muela y sensibilidad ante frío o calor pueden justificar una evaluación odontológica.",

        symptoms: {
            dolor_dental: 35,
            sensibilidad_dental: 30,
            fiebre: 5
        },

        characteristic: [
            "dolor_dental",
            "sensibilidad_dental"
        ],

        questions: [
            "dental"
        ],

        advice:
            "Las molestias dentales persistentes o acompañadas de hinchazón o fiebre deberían ser valoradas por un profesional de odontología."
    },


    {
        id: "skin",

        name: "Patrón relacionado con irritación de la piel",

        category: "Piel",

        description:
            "Picazón, manchas, ronchas o irritación pueden tener múltiples causas, por lo que el contexto y la evolución son importantes.",

        symptoms: {
            picazon: 25,
            erupcion: 30,
            dolor_piel: 15,
            fiebre: 4
        },

        characteristic: [
            "erupcion",
            "picazon"
        ],

        questions: [
            "skin"
        ],

        advice:
            "Observa si la lesión se extiende rápidamente, aparece hinchazón importante o existen síntomas generales."
    },


    {
        id: "viral_general",

        name: "Patrón compatible con infección viral inespecífica",

        category: "General",

        description:
            "Fiebre, cansancio, dolor de cabeza y dolores corporales pueden aparecer en diferentes infecciones virales.",

        symptoms: {
            fiebre: 20,
            cansancio: 15,
            dolor_cabeza: 12,
            dolor_muscular: 15,
            dolor_garganta: 8,
            tos: 7,
            nauseas: 5
        },

        characteristic: [
            "fiebre",
            "cansancio"
        ],

        questions: [
            "onset",
            "fever"
        ],

        advice:
            "Los síntomas generales pueden tener muchas causas. La evolución y los síntomas acompañantes son importantes."
    }

];


/* =========================================================
   7. PREGUNTAS DE SEGUIMIENTO
========================================================= */

const QUESTION_BANK = {

    onset: {

        id: "onset",

        title: "¿Cómo comenzaron los síntomas?",

        description:
            "La forma en que comenzaron puede ayudar a diferenciar algunos patrones.",

        options: [
            {
                value: "sudden",
                label: "De repente",
                icon: "fa-bolt"
            },
            {
                value: "gradual",
                label: "Poco a poco",
                icon: "fa-chart-line"
            },
            {
                value: "uncertain",
                label: "No estoy seguro",
                icon: "fa-question"
            }
        ]
    },


    fever: {

        id: "fever",

        title: "¿Has tenido fiebre?",

        description:
            "Indica cuál opción representa mejor lo que has experimentado.",

        options: [
            {
                value: "high",
                label: "Sí, bastante alta",
                icon: "fa-temperature-high"
            },
            {
                value: "low",
                label: "Sí, pero leve",
                icon: "fa-temperature-half"
            },
            {
                value: "none",
                label: "No",
                icon: "fa-temperature-empty"
            },
            {
                value: "unknown",
                label: "No lo sé",
                icon: "fa-question"
            }
        ]
    },


    respiratory: {

        id: "respiratory",

        title: "¿Cómo está tu respiración?",

        description:
            "Esta pregunta es importante para valorar si existe una señal de atención.",

        options: [
            {
                value: "normal",
                label: "Normal",
                icon: "fa-lungs"
            },
            {
                value: "mild",
                label: "Algo más difícil de lo habitual",
                icon: "fa-wind"
            },
            {
                value: "severe",
                label: "Me cuesta mucho respirar",
                icon: "fa-triangle-exclamation",
                danger: true
            }
        ]
    },


    allergy: {

        id: "allergy",

        title: "¿Los síntomas aparecen con algún desencadenante?",

        description:
            "Por ejemplo, polvo, polen, animales, cambios ambientales u otros factores.",

        options: [
            {
                value: "yes",
                label: "Sí, parece relacionarse",
                icon: "fa-leaf"
            },
            {
                value: "no",
                label: "No",
                icon: "fa-circle-xmark"
            },
            {
                value: "unknown",
                label: "No estoy seguro",
                icon: "fa-question"
            }
        ]
    },


    gastro: {

        id: "gastro",

        title: "¿Cuál es el síntoma digestivo principal?",

        description:
            "Selecciona la opción que mejor describa lo que ocurre.",

        options: [
            {
                value: "diarrhea",
                label: "Diarrea",
                icon: "fa-droplet"
            },
            {
                value: "vomiting",
                label: "Vómitos",
                icon: "fa-arrows-rotate"
            },
            {
                value: "pain",
                label: "Dolor abdominal",
                icon: "fa-stomach"
            },
            {
                value: "mixed",
                label: "Varios de los anteriores",
                icon: "fa-list"
            }
        ]
    },


    hydration: {

        id: "hydration",

        title: "¿Cómo está tu hidratación?",

        description:
            "Piensa especialmente en sed, orina y capacidad para beber líquidos.",

        options: [
            {
                value: "normal",
                label: "Puedo beber y orino normalmente",
                icon: "fa-glass-water"
            },
            {
                value: "reduced",
                label: "Bebo menos o estoy orinando menos",
                icon: "fa-droplet"
            },
            {
                value: "severe",
                label: "Casi no puedo beber o casi no orino",
                icon: "fa-triangle-exclamation",
                danger: true
            }
        ]
    },


    headache: {

        id: "headache",

        title: "¿Cómo describirías el dolor de cabeza?",

        description:
            "La intensidad y características del dolor son importantes.",

        options: [
            {
                value: "pressure",
                label: "Presión o tensión",
                icon: "fa-circle"
            },
            {
                value: "pulsating",
                label: "Pulsátil o palpitante",
                icon: "fa-wave-square"
            },
            {
                value: "sudden_severe",
                label: "Muy intenso y apareció de repente",
                icon: "fa-triangle-exclamation",
                danger: true
            },
            {
                value: "mild",
                label: "Leve o moderado",
                icon: "fa-circle-half-stroke"
            }
        ]
    },


    sleep: {

        id: "sleep",

        title: "¿Cómo has estado durmiendo?",

        description:
            "Esto ayuda a distinguir cansancio por sueño insuficiente de otros patrones.",

        options: [
            {
                value: "little",
                label: "He dormido poco",
                icon: "fa-bed"
            },
            {
                value: "poor",
                label: "Duermo pero no descanso",
                icon: "fa-moon"
            },
            {
                value: "normal",
                label: "Duermo normalmente",
                icon: "fa-face-smile"
            }
        ]
    },


    stress: {

        id: "stress",

        title: "¿Has tenido estrés o preocupación recientemente?",

        description:
            "Piensa en los últimos días o semanas.",

        options: [
            {
                value: "high",
                label: "Sí, bastante",
                icon: "fa-brain"
            },
            {
                value: "moderate",
                label: "Algo de estrés",
                icon: "fa-cloud"
            },
            {
                value: "low",
                label: "No especialmente",
                icon: "fa-face-smile"
            }
        ]
    },


    dental: {

        id: "dental",

        title: "¿El dolor está localizado en un diente o muela?",

        description:
            "La localización puede ayudar a determinar si conviene una valoración odontológica.",

        options: [
            {
                value: "yes",
                label: "Sí",
                icon: "fa-tooth"
            },
            {
                value: "no",
                label: "No",
                icon: "fa-circle-xmark"
            },
            {
                value: "unknown",
                label: "No estoy seguro",
                icon: "fa-question"
            }
        ]
    },


    skin: {

        id: "skin",

        title: "¿Cómo ha evolucionado la alteración de la piel?",

        description:
            "Selecciona la descripción más cercana.",

        options: [
            {
                value: "localized",
                label: "Está localizada",
                icon: "fa-location-dot"
            },
            {
                value: "spreading",
                label: "Se está extendiendo",
                icon: "fa-expand"
            },
            {
                value: "unknown",
                label: "No estoy seguro",
                icon: "fa-question"
            }
        ]
    }
};


/* =========================================================
   8. SEÑALES DE ALARMA
========================================================= */

const RED_FLAGS = [

    {
        symptom: "dificultad_respirar",

        title: "Dificultad importante para respirar",

        message:
            "La dificultad respiratoria nueva, intensa o que interfiere con hablar o respirar requiere atención médica urgente."
    },

    {
        symptom: "dolor_pecho",

        title: "Dolor o presión en el pecho",

        message:
            "El dolor o presión en el pecho, especialmente si es persistente o intenso, puede requerir atención urgente."
    },

    {
        symptom: "desmayo",

        title: "Pérdida del conocimiento",

        message:
            "Un desmayo o pérdida del conocimiento debe valorarse médicamente."
    },

    {
        symptom: "confusion",

        title: "Confusión o alteración importante del estado mental",

        message:
            "La confusión repentina o dificultad para despertar constituye una señal de atención urgente."
    },

    {
        symptom: "poca_orina",

        title: "Muy poca o ninguna orina",

        message:
            "Una disminución marcada de la orina, especialmente junto con mareos o confusión, puede indicar una deshidratación importante."
    }
];


/* =========================================================
   9. INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});


function initializeApplication() {

    bindEvents();

    renderSelectedSymptoms();

    updateAnalyzeButton();

    initializeNavigation();

    initializeTheme();

    initializeScrollButton();

    hideLoader();

}


/* =========================================================
   10. EVENTOS
========================================================= */

function bindEvents() {

    if (elements.symptomInput) {

        elements.symptomInput.addEventListener(
            "input",
            handleSymptomInput
        );

        elements.symptomInput.addEventListener(
            "keydown",
            handleInputKeydown
        );
    }


    if (elements.clearSearch) {

        elements.clearSearch.addEventListener(
            "click",
            clearSearch
        );
    }


    if (elements.clearSymptoms) {

        elements.clearSymptoms.addEventListener(
            "click",
            clearAllSymptoms
        );
    }


    if (elements.analyzeButton) {

        elements.analyzeButton.addEventListener(
            "click",
            startAnalysis
        );
    }


    if (elements.newAnalysisButton) {

        elements.newAnalysisButton.addEventListener(
            "click",
            resetApplication
        );
    }


    if (elements.tryAgainButton) {

        elements.tryAgainButton.addEventListener(
            "click",
            () => {

                document
                    .getElementById("explorador")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );
    }


    document
        .querySelectorAll(".symptom-chip")
        .forEach(chip => {

            chip.addEventListener(
                "click",
                () => {

                    const symptom =
                        chip.dataset.symptom;

                    const detected =
                        findSymptomByText(symptom);

                    if (detected) {

                        addSymptom(detected);

                        chip.classList.add("selected");

                        setTimeout(() => {
                            chip.classList.remove("selected");
                        }, 350);
                    }

                }
            );

        });


    if (elements.scrollTopButton) {

        elements.scrollTopButton.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    if (elements.themeToggle) {

        elements.themeToggle.addEventListener(
            "click",
            toggleTheme
        );
    }


    if (elements.mobileMenuButton) {

        elements.mobileMenuButton.addEventListener(
            "click",
            toggleMobileMenu
        );
    }


    if (elements.closeModal) {

        elements.closeModal.addEventListener(
            "click",
            closeModal
        );
    }


    if (elements.modalConfirm) {

        elements.modalConfirm.addEventListener(
            "click",
            closeModal
        );
    }


    if (elements.informationModal) {

        elements.informationModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.informationModal
                ) {
                    closeModal();
                }

            }
        );
    }

}


/* =========================================================
   11. INPUT DE SÍNTOMAS
========================================================= */

function handleSymptomInput(event) {

    const text = event.target.value.trim();

    state.userText = text;

    if (!text) {

        renderSuggestions([]);

        return;
    }


    const suggestions =
        getSuggestions(text);

    renderSuggestions(suggestions);

}


function handleInputKeydown(event) {

    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();

    const text =
        elements.symptomInput.value.trim();

    if (!text) {
        return;
    }


    const detected =
        detectSymptoms(text);

    if (detected.length === 0) {

        showToast(
            "No reconocí un síntoma concreto. Intenta describirlo con otras palabras.",
            "warning"
        );

        return;
    }


    detected.forEach(symptom => {
        addSymptom(symptom);
    });


    elements.symptomInput.value = "";

    renderSuggestions([]);

}


/* =========================================================
   12. DETECCIÓN DE SÍNTOMAS
========================================================= */

function detectSymptoms(text) {

    const normalized =
        normalizeText(text);

    const found = [];

    for (const [id, symptom] of Object.entries(SYMPTOMS)) {

        let matched = false;

        for (const synonym of symptom.synonyms) {

            const normalizedSynonym =
                normalizeText(synonym);

            if (
                normalized.includes(
                    normalizedSynonym
                )
            ) {

                matched = true;
                break;

            }
        }


        if (matched) {

            found.push({
                id,
                ...symptom
            });

        }

    }


    return found;
}


/* =========================================================
   13. BÚSQUEDA DE SUGERENCIAS
========================================================= */

function getSuggestions(text) {

    const normalized =
        normalizeText(text);

    if (!normalized) {
        return [];
    }


    return Object.entries(SYMPTOMS)

        .map(([id, symptom]) => {

            let score = 0;

            symptom.synonyms.forEach(
                synonym => {

                    const normalizedSynonym =
                        normalizeText(synonym);

                    if (
                        normalizedSynonym
                            .startsWith(normalized)
                    ) {
                        score += 5;
                    }

                    if (
                        normalizedSynonym
                            .includes(normalized)
                    ) {
                        score += 2;
                    }

                }
            );


            return {
                id,
                ...symptom,
                score
            };

        })

        .filter(item => item.score > 0)

        .sort(
            (a, b) => b.score - a.score
        )

        .slice(0, 6);
}


/* =========================================================
   14. RENDER SUGERENCIAS
========================================================= */

function renderSuggestions(suggestions) {

    if (!elements.symptomSuggestions) {
        return;
    }


    if (!suggestions.length) {

        elements.symptomSuggestions.innerHTML = "";

        return;
    }


    elements.symptomSuggestions.innerHTML =
        suggestions
            .map(symptom => `

                <button
                    type="button"
                    class="suggestion-item"
                    data-symptom-id="${symptom.id}"
                >

                    <span class="suggestion-icon">

                        <i class="fa-solid ${getSymptomIcon(symptom.category)}"></i>

                    </span>

                    <span class="suggestion-text">

                        <strong>
                            ${escapeHTML(symptom.label)}
                        </strong>

                        <small>
                            ${escapeHTML(symptom.category)}
                        </small>

                    </span>

                    <i class="fa-solid fa-plus"></i>

                </button>

            `)
            .join("");


    elements.symptomSuggestions
        .querySelectorAll(".suggestion-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.symptomId;

                    const symptom =
                        getSymptomById(id);

                    if (symptom) {

                        addSymptom(symptom);

                    }

                    elements.symptomInput.value = "";

                    renderSuggestions([]);

                }
            );

        });

}


/* =========================================================
   15. AGREGAR SÍNTOMA
========================================================= */

function addSymptom(symptom) {

    if (!symptom || !symptom.id) {
        return;
    }


    const exists =
        state.selectedSymptoms
            .some(
                item =>
                    item.id === symptom.id
            );


    if (exists) {

        showToast(
            `${symptom.label} ya está seleccionado.`,
            "info"
        );

        return;
    }


    state.selectedSymptoms.push({
        id: symptom.id,
        label: symptom.label,
        category: symptom.category,
        emergency: Boolean(symptom.emergency)
    });


    renderSelectedSymptoms();

    updateAnalyzeButton();

    updateHeroCounter();

}


/* =========================================================
   16. ELIMINAR SÍNTOMA
========================================================= */

function removeSymptom(id) {

    state.selectedSymptoms =
        state.selectedSymptoms
            .filter(
                symptom =>
                    symptom.id !== id
            );


    renderSelectedSymptoms();

    updateAnalyzeButton();

    updateHeroCounter();

}


/* =========================================================
   17. RENDER SÍNTOMAS SELECCIONADOS
========================================================= */

function renderSelectedSymptoms() {

    if (!elements.selectedSymptoms) {
        return;
    }


    const count =
        state.selectedSymptoms.length;


    if (elements.selectedSymptomsCount) {

        elements.selectedSymptomsCount.textContent =
            count;

    }


    if (elements.emptySymptomsMessage) {

        elements.emptySymptomsMessage.style.display =
            count === 0
                ? "flex"
                : "none";

    }


    const oldTags =
        elements.selectedSymptoms
            .querySelectorAll(
                ".selected-symptom-tag"
            );


    oldTags.forEach(tag => tag.remove());


    state.selectedSymptoms.forEach(
        symptom => {

            const tag =
                document.createElement("div");

            tag.className =
                "selected-symptom-tag";


            tag.innerHTML = `

                <span class="selected-symptom-icon">

                    <i class="fa-solid ${getSymptomIcon(symptom.category)}"></i>

                </span>

                <span>
                    ${escapeHTML(symptom.label)}
                </span>

                <button
                    type="button"
                    aria-label="Eliminar ${escapeHTML(symptom.label)}"
                    data-remove="${symptom.id}"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            `;


            tag
                .querySelector("button")
                .addEventListener(
                    "click",
                    () => removeSymptom(symptom.id)
                );


            elements.selectedSymptoms.appendChild(tag);

        }
    );

}


/* =========================================================
   18. BOTÓN ANALIZAR
========================================================= */

function updateAnalyzeButton() {

    if (!elements.analyzeButton) {
        return;
    }


    const hasSymptoms =
        state.selectedSymptoms.length > 0;


    elements.analyzeButton.disabled =
        !hasSymptoms;


    if (hasSymptoms) {

        elements.analyzeButton
            .classList.add("ready");

    } else {

        elements.analyzeButton
            .classList.remove("ready");

    }

}


/* =========================================================
   19. CONTADOR DEL HERO
========================================================= */

function updateHeroCounter() {

    if (!elements.heroSymptomCount) {
        return;
    }

    elements.heroSymptomCount.textContent =
        state.selectedSymptoms.length;

}


/* =========================================================
   20. INICIAR ANÁLISIS
========================================================= */

async function startAnalysis() {

    if (
        state.selectedSymptoms.length === 0
    ) {

        showToast(
            "Selecciona al menos un síntoma.",
            "warning"
        );

        return;
    }


    state.analysisStarted = true;

    state.analysisFinished = false;

    state.answers = {};

    state.emergencyFlags = [];


    const symptomIds =
        state.selectedSymptoms.map(
            symptom => symptom.id
        );


    state.detectedSymptoms =
        symptomIds;


    detectEmergencySymptoms();


    hideResults();

    showLoading();


    await simulateAnalysis();


    state.preliminaryResults =
        calculateResults();


    const questions =
        buildFollowUpQuestions();


    state.followUpQuestions =
        questions;


    hideLoading();


    if (questions.length > 0) {

        renderFollowUpQuestions();

        return;
    }


    finishAnalysis();

}


/* =========================================================
   21. DETECTAR EMERGENCIAS
========================================================= */

function detectEmergencySymptoms() {

    const selectedIds =
        new Set(state.detectedSymptoms);


    RED_FLAGS.forEach(flag => {

        if (
            selectedIds.has(flag.symptom)
        ) {

            state.emergencyFlags.push(flag);

        }

    });

}


/* =========================================================
   22. SIMULAR PROCESO DE ANÁLISIS
========================================================= */

function simulateAnalysis() {

    return new Promise(resolve => {

        let progress = 0;

        const messages = [

            "Identificando los síntomas...",

            "Relacionando términos y sinónimos...",

            "Comparando combinaciones de síntomas...",

            "Buscando patrones relevantes...",

            "Preparando preguntas de seguimiento..."

        ];


        const interval =
            setInterval(() => {

                progress += 20;


                if (
                    elements.analysisProgressBar
                ) {

                    elements.analysisProgressBar.style.width =
                        `${progress}%`;

                }


                if (
                    elements.analysisProgressText
                ) {

                    elements.analysisProgressText.textContent =
                        `${progress}%`;

                }


                if (
                    elements.loadingMessage
                ) {

                    const index =
                        Math.min(
                            Math.floor(
                                progress / 20
                            ) - 1,
                            messages.length - 1
                        );

                    elements.loadingMessage.textContent =
                        messages[index];

                }


                if (progress >= 100) {

                    clearInterval(interval);

                    setTimeout(
                        resolve,
                        CONFIG.analysisDelay
                    );

                }

            }, 180);

    });

}


/* =========================================================
   23. CALCULAR RESULTADOS PRELIMINARES
========================================================= */

function calculateResults() {

    const selected =
        new Set(state.detectedSymptoms);


    const results =
        CONDITIONS.map(condition => {

            let score = 0;

            let matched = [];

            let missingCharacteristic = [];


            Object.entries(
                condition.symptoms
            ).forEach(
                ([symptomId, weight]) => {

                    if (
                        selected.has(symptomId)
                    ) {

                        score += weight;

                        matched.push({
                            id: symptomId,
                            weight
                        });

                    }

                }
            );


            condition.characteristic.forEach(
                symptomId => {

                    if (
                        !selected.has(symptomId)
                    ) {

                        missingCharacteristic.push(
                            symptomId
                        );

                    }

                }
            );


            /*
             * Bonus por combinación.
             * Tener varios síntomas relacionados
             * vale más que tener uno solo.
             */

            if (matched.length >= 2) {
                score += 8;
            }

            if (matched.length >= 3) {
                score += 10;
            }

            if (matched.length >= 4) {
                score += 8;
            }


            /*
             * Penalización si solo coincide
             * un síntoma débil.
             */

            if (
                matched.length === 1 &&
                matched[0].weight < 15
            ) {

                score -= 15;

            }


            /*
             * Normalización aproximada.
             */

            const maxPossible =
                Object.values(
                    condition.symptoms
                )
                .sort((a, b) => b - a)
                .slice(0, 5)
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );


            let percentage =
                maxPossible > 0
                    ? Math.round(
                        (score / maxPossible) *
                        100
                    )
                    : 0;


            percentage =
                Math.max(
                    0,
                    Math.min(
                        percentage,
                        97
                    )
                );


            return {

                ...condition,

                score,

                percentage,

                matched,

                matchedCount:
                    matched.length,

                missingCharacteristic

            };

        });


    return results

        .filter(
            result =>
                result.score >=
                CONFIG.minimumScore
        )

        .sort(
            (a, b) =>
                b.score - a.score
        )

        .slice(
            0,
            CONFIG.maxResults
        );

}


/* =========================================================
   24. CONSTRUIR PREGUNTAS
========================================================= */

function buildFollowUpQuestions() {

    const needed = new Set();


    state.preliminaryResults
        .forEach(result => {

            result.questions
                .forEach(questionId => {

                    needed.add(questionId);

                });

        });


    /*
     * Si hay síntomas respiratorios,
     * preguntar por respiración.
     */

    if (
        state.detectedSymptoms.some(
            id =>
                [
                    "tos",
                    "tos_seca",
                    "tos_con_flema",
                    "congestion_nasal",
                    "dolor_garganta"
                ].includes(id)
        )
    ) {

        needed.add("respiratory");

    }


    /*
     * Si hay dolor de cabeza.
     */

    if (
        state.detectedSymptoms.includes(
            "dolor_cabeza"
        ) ||
        state.detectedSymptoms.includes(
            "migraña"
        )
    ) {

        needed.add("headache");

    }


    /*
     * Si hay síntomas digestivos.
     */

    if (
        state.detectedSymptoms.some(
            id =>
                [
                    "nauseas",
                    "vomitos",
                    "diarrea",
                    "dolor_abdominal"
                ].includes(id)
        )
    ) {

        needed.add("gastro");

        needed.add("hydration");

    }


    return Array
        .from(needed)
        .map(
            id =>
                QUESTION_BANK[id]
        )
        .filter(Boolean)
        .slice(
            0,
            CONFIG.questionLimit
        );

}


/* =========================================================
   25. RENDER DE PREGUNTAS
========================================================= */

function renderFollowUpQuestions() {

    const existing =
        document.getElementById(
            "followUpSection"
        );


    if (existing) {
        existing.remove();
    }


    const section =
        document.createElement("section");


    section.id =
        "followUpSection";


    section.className =
        "follow-up-section";


    const container =
        document.createElement("div");


    container.className =
        "container";


    const card =
        document.createElement("div");


    card.className =
        "follow-up-card";


    card.innerHTML = `

        <div class="follow-up-header">

            <div class="follow-up-icon">

                <i class="fa-solid fa-comments"></i>

            </div>

            <div>

                <span class="section-eyebrow">
                    Un poco más de información
                </span>

                <h2>
                    Necesitamos algunas respuestas
                </h2>

                <p>
                    Estas preguntas ayudan a evitar resultados
                    basados únicamente en una coincidencia aislada.
                </p>

            </div>

        </div>


        <div
            id="questionsContainer"
            class="questions-container"
        ></div>


        <div class="follow-up-actions">

            <button
                type="button"
                id="finishQuestions"
                class="analyze-button ready"
            >

                <span class="button-icon">
                    <i class="fa-solid fa-chart-simple"></i>
                </span>

                <span class="button-text">
                    Continuar análisis
                </span>

                <span class="button-arrow">
                    <i class="fa-solid fa-arrow-right"></i>
                </span>

            </button>

        </div>

    `;


    container.appendChild(card);

    section.appendChild(container);


    const explorer =
        document.getElementById(
            "explorador"
        );


    explorer?.after(section);


    const questionsContainer =
        card.querySelector(
            "#questionsContainer"
        );


    state.followUpQuestions
        .forEach(
            (question, index) => {

                const questionElement =
                    createQuestionElement(
                        question,
                        index
                    );

                questionsContainer
                    .appendChild(
                        questionElement
                    );

            }
        );


    const finishButton =
        card.querySelector(
            "#finishQuestions"
        );


    finishButton.addEventListener(
        "click",
        finishAnalysis
    );


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   26. CREAR PREGUNTA
========================================================= */

function createQuestionElement(
    question,
    index
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "question-block";


    wrapper.dataset.questionId =
        question.id;


    wrapper.innerHTML = `

        <div class="question-number">
            ${String(index + 1).padStart(2, "0")}
        </div>

        <div class="question-content">

            <h3>
                ${escapeHTML(question.title)}
            </h3>

            <p>
                ${escapeHTML(question.description)}
            </p>

            <div class="question-options">

                ${question.options
                    .map(option => `

                        <button
                            type="button"
                            class="question-option ${
                                option.danger
                                    ? "danger-option"
                                    : ""
                            }"
                            data-question="${question.id}"
                            data-value="${option.value}"
                        >

                            <span class="question-option-icon">

                                <i class="fa-solid ${option.icon}"></i>

                            </span>

                            <span>
                                ${escapeHTML(option.label)}
                            </span>

                            <i class="fa-solid fa-check option-check"></i>

                        </button>

                    `)
                    .join("")
                }

            </div>

        </div>

    `;


    wrapper
        .querySelectorAll(
            ".question-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const questionId =
                        button.dataset.question;

                    const value =
                        button.dataset.value;


                    state.answers[
                        questionId
                    ] = value;


                    wrapper
                        .querySelectorAll(
                            ".question-option"
                        )
                        .forEach(
                            option =>
                                option.classList
                                    .remove("selected")
                        );


                    button.classList.add(
                        "selected"
                    );


                    /*
                     * Si la respuesta es una señal
                     * de alarma, avisamos inmediatamente.
                     */

                    if (
                        button.classList
                            .contains(
                                "danger-option"
                            )
                    ) {

                        showToast(
                            "Esta respuesta puede indicar una situación que requiere atención médica.",
                            "danger"
                        );

                    }

                }
            );

        });


    return wrapper;

}


/* =========================================================
   27. FINALIZAR ANÁLISIS
========================================================= */

function finishAnalysis() {

    /*
     * Si hay preguntas sin responder,
     * permitimos continuar pero mostramos aviso.
     */

    const unanswered =
        state.followUpQuestions
            .filter(
                question =>
                    !state.answers[
                        question.id
                    ]
            );


    if (
        unanswered.length > 0
    ) {

        showToast(
            `Puedes responder ${unanswered.length} pregunta${
                unanswered.length > 1
                    ? "s"
                    : ""
            } para obtener una orientación más precisa.`,
            "info"
        );

    }


    state.finalResults =
        applyFollowUpAnswers(
            state.preliminaryResults
        );


    state.analysisFinished = true;


    const followUp =
        document.getElementById(
            "followUpSection"
        );


    if (followUp) {

        followUp.remove();

    }


    renderResults();

}


/* =========================================================
   28. APLICAR RESPUESTAS
========================================================= */

function applyFollowUpAnswers(
    results
) {

    return results

        .map(result => {

            let score =
                result.score;


            const answers =
                state.answers;


            /*
             * APARICIÓN
             */

            if (
                result.id ===
                "influenza_like"
            ) {

                if (
                    answers.onset ===
                    "sudden"
                ) {

                    score += 15;

                }

                if (
                    answers.onset ===
                    "gradual"
                ) {

                    score -= 3;

                }

            }


            if (
                result.id ===
                "resfriado"
            ) {

                if (
                    answers.onset ===
                    "gradual"
                ) {

                    score += 10;

                }

                if (
                    answers.onset ===
                    "sudden"
                ) {

                    score -= 3;

                }

            }


            /*
             * FIEBRE
             */

            if (
                result.id ===
                "influenza_like"
            ) {

                if (
                    answers.fever ===
                    "high"
                ) {

                    score += 14;

                }

                if (
                    answers.fever ===
                    "none"
                ) {

                    score -= 8;

                }

            }


            if (
                result.id ===
                "resfriado"
            ) {

                if (
                    answers.fever ===
                    "none"
                ) {

                    score += 7;

                }

                if (
                    answers.fever ===
                    "high"
                ) {

                    score -= 4;

                }

            }


            /*
             * ALERGIAS
             */

            if (
                result.id ===
                "allergic_rhinitis"
            ) {

                if (
                    answers.allergy ===
                    "yes"
                ) {

                    score += 18;

                }

                if (
                    answers.allergy ===
                    "no"
                ) {

                    score -= 6;

                }

            }


            /*
             * GASTRO
             */

            if (
                result.id ===
                "gastroenteritis_like"
            ) {

                if (
                    answers.gastro ===
                    "mixed"
                ) {

                    score += 15;

                }

                if (
                    answers.gastro ===
                    "diarrhea"
                ) {

                    score += 8;

                }

                if (
                    answers.gastro ===
                    "vomiting"
                ) {

                    score += 8;

                }

            }


            /*
             * HIDRATACIÓN
             */

            if (
                result.id ===
                "dehydration"
            ) {

                if (
                    answers.hydration ===
                    "reduced"
                ) {

                    score += 15;

                }

                if (
                    answers.hydration ===
                    "severe"
                ) {

                    score += 25;

                }

                if (
                    answers.hydration ===
                    "normal"
                ) {

                    score -= 12;

                }

            }


            /*
             * CEFALEA
             */

            if (
                result.id ===
                "tension_headache"
            ) {

                if (
                    answers.headache ===
                    "pressure"
                ) {

                    score += 18;

                }

                if (
                    answers.headache ===
                    "pulsating"
                ) {

                    score -= 6;

                }

            }


            if (
                result.id ===
                "migraine_like"
            ) {

                if (
                    answers.headache ===
                    "pulsating"
                ) {

                    score += 18;

                }

                if (
                    answers.headache ===
                    "pressure"
                ) {

                    score -= 5;

                }

            }


            /*
             * SUEÑO
             */

            if (
                result.id ===
                "sleep_deprivation"
            ) {

                if (
                    answers.sleep ===
                    "little"
                ) {

                    score += 18;

                }

                if (
                    answers.sleep ===
                    "poor"
                ) {

                    score += 15;

                }

                if (
                    answers.sleep ===
                    "normal"
                ) {

                    score -= 12;

                }

            }


            /*
             * ESTRÉS
             */

            if (
                result.id ===
                "stress_related"
            ) {

                if (
                    answers.stress ===
                    "high"
                ) {

                    score += 18;

                }

                if (
                    answers.stress ===
                    "moderate"
                ) {

                    score += 8;

                }

                if (
                    answers.stress ===
                    "low"
                ) {

                    score -= 10;

                }

            }


            /*
             * RESPIRACIÓN
             *
             * No utilizamos esto para diagnosticar.
             * Solo aumenta la prioridad de atención.
             */

            if (
                answers.respiratory ===
                "severe"
            ) {

                state.emergencyFlags.push({

                    title:
                        "Dificultad importante para respirar",

                    message:
                        "La dificultad respiratoria importante o que interfiere con hablar requiere atención médica urgente."

                });

            }


            /*
             * HIDRATACIÓN SEVERA
             */

            if (
                answers.hydration ===
                "severe"
            ) {

                state.emergencyFlags.push({

                    title:
                        "Posibles signos importantes de deshidratación",

                    message:
                        "La incapacidad para mantener líquidos o la ausencia marcada de orina requiere valoración médica."

                });

            }


            /*
             * DOLOR DE CABEZA SÚBITO E INTENSO
             */

            if (
                answers.headache ===
                "sudden_severe"
            ) {

                state.emergencyFlags.push({

                    title:
                        "Dolor de cabeza muy intenso y repentino",

                    message:
                        "Un dolor de cabeza extremadamente intenso que aparece de forma repentina requiere valoración urgente."

                });

            }


            return {

                ...result,

                score

            };

        })

        .filter(
            result =>
                result.score >=
                CONFIG.minimumScore
        )

        .sort(
            (a, b) =>
                b.score - a.score
        )

        .slice(
            0,
            CONFIG.maxResults
        );

}


/* =========================================================
   29. RENDER RESULTADOS
========================================================= */

function renderResults() {

    if (!elements.results) {
        return;
    }


    elements.results.classList.remove(
        "hidden"
    );


    if (
        elements.resultSymptoms
    ) {

        elements.resultSymptoms.innerHTML =
            state.selectedSymptoms
                .map(
                    symptom => `

                        <span class="mini-tag">
                            ${escapeHTML(symptom.label)}
                        </span>

                    `
                )
                .join("");

    }


    renderWarnings();

    renderResultCards();


    elements.results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   30. TARJETAS DE RESULTADOS
========================================================= */

function renderResultCards() {

    if (
        !elements.resultsContainer
    ) {
        return;
    }


    elements.resultsContainer.innerHTML =
        "";


    if (
        state.finalResults.length === 0
    ) {

        if (elements.noResults) {

            elements.noResults
                .classList
                .remove("hidden");

        }

        return;

    }


    if (elements.noResults) {

        elements.noResults
            .classList
            .add("hidden");

    }


    state.finalResults.forEach(
        (result, index) => {

            const card =
                createResultCard(
                    result,
                    index
                );

            elements.resultsContainer
                .appendChild(card);

        }
    );


    if (elements.resultStatus) {

        elements.resultStatus.textContent =
            state.finalResults.length > 0
                ? "Coincidencias encontradas"
                : "Sin coincidencias claras";

    }

}


/* =========================================================
   31. CREAR TARJETA RESULTADO
========================================================= */

function createResultCard(
    result,
    index
) {

    const card =
        document.createElement("article");


    card.className =
        "result-card";


    const relation =
        getRelationLevel(
            result.score
        );


    const matchedNames =
        result.matched
            .sort(
                (a, b) =>
                    b.weight - a.weight
            )
            .slice(0, 6)
            .map(
                item => {

                    const symptom =
                        getSymptomById(
                            item.id
                        );

                    return symptom
                        ? symptom.label
                        : item.id;

                }
            );


    const missingNames =
        result.missingCharacteristic
            .slice(0, 3)
            .map(
                id => {

                    const symptom =
                        getSymptomById(id);

                    return symptom
                        ? symptom.label
                        : id;

                }
            );


    card.innerHTML = `

        <div class="result-card-top">

            <div class="result-rank">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="result-category">
                ${escapeHTML(result.category)}
            </div>

            <div class="result-relation ${relation.className}">
                ${relation.label}
            </div>

        </div>


        <div class="result-card-content">

            <h3>
                ${escapeHTML(result.name)}
            </h3>

            <p class="result-description">
                ${escapeHTML(result.description)}
            </p>


            <div class="result-score">

                <div class="score-header">

                    <span>
                        Relación con los síntomas introducidos
                    </span>

                    <strong>
                        ${result.percentage}%
                    </strong>

                </div>


                <div class="relation-bar">

                    <div
                        class="relation-bar-fill"
                        style="width:${result.percentage}%"
                    ></div>

                </div>

            </div>


            <div class="result-detail-grid">


                <div class="result-detail">

                    <div class="detail-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>

                    <div>

                        <strong>
                            Coincidencias
                        </strong>

                        <div class="detail-tags">

                            ${matchedNames
                                .map(
                                    name => `
                                        <span class="mini-tag">
                                            ${escapeHTML(name)}
                                        </span>
                                    `
                                )
                                .join("")
                            }

                        </div>

                    </div>

                </div>


                ${
                    missingNames.length > 0
                        ? `

                            <div class="result-detail">

                                <div class="detail-icon muted">
                                    <i class="fa-solid fa-circle-question"></i>
                                </div>

                                <div>

                                    <strong>
                                        Información que falta
                                    </strong>

                                    <div class="detail-tags">

                                        ${missingNames
                                            .map(
                                                name => `
                                                    <span class="mini-tag muted-tag">
                                                        ${escapeHTML(name)}
                                                    </span>
                                                `
                                            )
                                            .join("")
                                        }

                                    </div>

                                </div>

                            </div>

                        `
                        : ""
                }


            </div>


            <div class="result-advice">

                <div class="advice-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>

                <div>

                    <strong>
                        Información educativa
                    </strong>

                    <p>
                        ${escapeHTML(result.advice)}
                    </p>

                </div>

            </div>


            <div class="result-disclaimer-small">

                <i class="fa-solid fa-circle-info"></i>

                Esta coincidencia no confirma una enfermedad.
                Diferentes condiciones pueden compartir síntomas.

            </div>

        </div>

    `;


    return card;

}


/* =========================================================
   32. NIVEL DE RELACIÓN
========================================================= */

function getRelationLevel(score) {

    if (
        score >= CONFIG.strongMatch
    ) {

        return {
            label: "Relación alta",
            className: "high"
        };

    }


    if (
        score >= CONFIG.mediumMatch
    ) {

        return {
            label: "Relación moderada",
            className: "medium"
        };

    }


    return {
        label: "Relación baja",
        className: "low"
    };

}


/* =========================================================
   33. ADVERTENCIAS
========================================================= */

function renderWarnings() {

    if (!elements.warningPanel) {
        return;
    }


    const uniqueWarnings = [];

    const seen = new Set();


    state.emergencyFlags
        .forEach(flag => {

            const key =
                flag.title ||
                flag.symptom;


            if (!seen.has(key)) {

                seen.add(key);

                uniqueWarnings.push(flag);

            }

        });


    if (
        uniqueWarnings.length === 0
    ) {

        elements.warningPanel
            .classList
            .add("hidden");

        return;

    }


    elements.warningPanel
        .classList
        .remove("hidden");


    if (elements.warningList) {

        elements.warningList.innerHTML =
            uniqueWarnings
                .map(
                    warning => `

                        <li>

                            <strong>
                                ${escapeHTML(warning.title)}
                            </strong>

                            <span>
                                ${escapeHTML(warning.message)}
                            </span>

                        </li>

                    `
                )
                .join("");

    }

}


/* =========================================================
   34. OCULTAR RESULTADOS
========================================================= */

function hideResults() {

    if (elements.results) {

        elements.results
            .classList
            .add("hidden");

    }


    if (elements.noResults) {

        elements.noResults
            .classList
            .add("hidden");

    }


    if (elements.warningPanel) {

        elements.warningPanel
            .classList
            .add("hidden");

    }

}


/* =========================================================
   35. LOADING
========================================================= */

function showLoading() {

    if (!elements.analysisLoading) {
        return;
    }


    elements.analysisLoading
        .classList
        .remove("hidden");


    if (elements.analysisProgressBar) {

        elements.analysisProgressBar.style.width =
            "0%";

    }


    if (elements.analysisProgressText) {

        elements.analysisProgressText.textContent =
            "0%";

    }


    if (elements.loadingMessage) {

        elements.loadingMessage.textContent =
            "Preparando análisis...";

    }

}


function hideLoading() {

    if (!elements.analysisLoading) {
        return;
    }


    elements.analysisLoading
        .classList
        .add("hidden");

}


/* =========================================================
   36. LIMPIAR BÚSQUEDA
========================================================= */

function clearSearch() {

    if (elements.symptomInput) {

        elements.symptomInput.value = "";

        elements.symptomInput.focus();

    }


    renderSuggestions([]);

}


/* =========================================================
   37. LIMPIAR SÍNTOMAS
========================================================= */

function clearAllSymptoms() {

    state.selectedSymptoms = [];

    state.detectedSymptoms = [];

    state.answers = {};

    renderSelectedSymptoms();

    updateAnalyzeButton();

    updateHeroCounter();


    showToast(
        "Se han eliminado los síntomas seleccionados.",
        "info"
    );

}


/* =========================================================
   38. RESET COMPLETO
========================================================= */

function resetApplication() {

    state.selectedSymptoms = [];

    state.detectedSymptoms = [];

    state.userText = "";

    state.followUpQuestions = [];

    state.answers = {};

    state.preliminaryResults = [];

    state.finalResults = [];

    state.emergencyFlags = [];

    state.analysisStarted = false;

    state.analysisFinished = false;


    const followUp =
        document.getElementById(
            "followUpSection"
        );


    if (followUp) {
        followUp.remove();
    }


    clearSearch();

    renderSelectedSymptoms();

    updateAnalyzeButton();

    updateHeroCounter();

    hideLoading();

    hideResults();


    document
        .getElementById("explorador")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   39. NAVEGACIÓN
========================================================= */

function initializeNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                links.forEach(
                    item =>
                        item.classList
                            .remove("active")
                );


                link.classList.add(
                    "active"
                );


                if (
                    elements.mainNavigation
                ) {

                    elements.mainNavigation
                        .classList
                        .remove("open");

                }

            }
        );

    });


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );

}


function updateActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const scrollPosition =
        window.scrollY + 160;


    let currentId = "";


    sections.forEach(section => {

        if (
            section.offsetTop <=
            scrollPosition
        ) {

            currentId =
                section.id;

        }

    });


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                `#${currentId}`
            );

        });

}


/* =========================================================
   40. MENÚ MÓVIL
========================================================= */

function toggleMobileMenu() {

    if (
        !elements.mainNavigation
    ) {
        return;
    }


    const isOpen =
        elements.mainNavigation
            .classList
            .toggle("open");


    if (elements.mobileMenuButton) {

        elements.mobileMenuButton
            .setAttribute(
                "aria-expanded",
                String(isOpen)
            );

    }

}


/* =========================================================
   41. TEMA
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "eduhealth-theme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body
            .classList
            .add("dark-theme");


        updateThemeIcon();

    }

}


function toggleTheme() {

    document.body
        .classList
        .toggle("dark-theme");


    const isDark =
        document.body
            .classList
            .contains(
                "dark-theme"
            );


    localStorage.setItem(
        "eduhealth-theme",
        isDark
            ? "dark"
            : "light"
    );


    updateThemeIcon();

}


function updateThemeIcon() {

    if (!elements.themeToggle) {
        return;
    }


    const icon =
        elements.themeToggle
            .querySelector("i");


    if (!icon) {
        return;
    }


    const isDark =
        document.body
            .classList
            .contains(
                "dark-theme"
            );


    icon.className =
        isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

}


/* =========================================================
   42. BOTÓN VOLVER ARRIBA
========================================================= */

function initializeScrollButton() {

    window.addEventListener(
        "scroll",
        () => {

            if (
                !elements.scrollTopButton
            ) {
                return;
            }


            if (
                window.scrollY > 500
            ) {

                elements.scrollTopButton
                    .classList
                    .add("visible");

            } else {

                elements.scrollTopButton
                    .classList
                    .remove("visible");

            }

        }
    );

}


/* =========================================================
   43. MODAL
========================================================= */

function openModal(
    title,
    content
) {

    if (
        !elements.informationModal
    ) {
        return;
    }


    elements.modalTitle.textContent =
        title;


    elements.modalContent.innerHTML =
        content;


    elements.informationModal
        .classList
        .remove("hidden");


    document.body
        .classList
        .add("modal-open");

}


function closeModal() {

    if (
        !elements.informationModal
    ) {
        return;
    }


    elements.informationModal
        .classList
        .add("hidden");


    document.body
        .classList
        .remove("modal-open");

}


/* =========================================================
   44. TOAST
========================================================= */

function showToast(
    message,
    type = "info"
) {

    if (!elements.toastContainer) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${type}`;


    const icon =
        getToastIcon(type);


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="toast-message">

            ${escapeHTML(message)}

        </div>

        <button
            type="button"
            class="toast-close"
            aria-label="Cerrar"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    toast
        .querySelector(
            ".toast-close"
        )
        .addEventListener(
            "click",
            () => {

                toast.remove();

            }
        );


    elements.toastContainer
        .appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );

    });


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );


        setTimeout(
            () => toast.remove(),
            300
        );

    }, 5000);

}


/* =========================================================
   45. ICONOS
========================================================= */

function getSymptomIcon(category) {

    const icons = {

        respiratorio:
            "fa-lungs",

        neurologico:
            "fa-brain",

        digestivo:
            "fa-stomach",

        hidratacion:
            "fa-glass-water",

        general:
            "fa-heart-pulse",

        cardiopulmonar:
            "fa-heart-pulse",

        dental:
            "fa-tooth",

        piel:
            "fa-hand-dots",

        ocular:
            "fa-eye",

        sueño:
            "fa-bed",

        emocional:
            "fa-brain"

    };


    return (
        icons[category] ||
        "fa-notes-medical"
    );

}


function getToastIcon(type) {

    const icons = {

        info:
            "fa-circle-info",

        success:
            "fa-circle-check",

        warning:
            "fa-triangle-exclamation",

        danger:
            "fa-circle-exclamation"

    };


    return (
        icons[type] ||
        icons.info
    );

}


/* =========================================================
   46. OBTENER SÍNTOMA
========================================================= */

function getSymptomById(id) {

    if (!SYMPTOMS[id]) {
        return null;
    }


    return {
        id,
        ...SYMPTOMS[id]
    };

}


function findSymptomByText(text) {

    const detected =
        detectSymptoms(text);


    return detected.length
        ? detected[0]
        : null;

}


/* =========================================================
   47. ESCAPAR HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   48. LOADER INICIAL
========================================================= */

function hideLoader() {

    if (!elements.appLoader) {
        return;
    }


    setTimeout(() => {

        elements.appLoader
            .classList
            .add("hidden");

    }, 450);

}


/* =========================================================
   49. EXPOSICIÓN OPCIONAL PARA DEBUG
========================================================= */

/*
 * Esto permite probar desde la consola del navegador:
 *
 * EduHealth.detectSymptoms("tengo tos y fiebre")
 *
 * EduHealth.results()
 */

window.EduHealth = {

    detectSymptoms(text) {

        return detectSymptoms(text)
            .map(
                symptom =>
                    symptom.label
            );

    },


    results() {

        return state.finalResults;

    },


    state

};


/* =========================================================
   FIN DE EDUHEALTH
========================================================= */
