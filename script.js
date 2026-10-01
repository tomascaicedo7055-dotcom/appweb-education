/* =========================================
   SALUD ESCOLAR
   Sistema educativo de búsqueda de síntomas

   IMPORTANTE:
   Este sistema NO realiza diagnósticos médicos.
   Solamente busca coincidencias educativas.
========================================= */


/* =========================================
   BASE DE DATOS EDUCATIVA
========================================= */

const problemas = [

    {
        nombre: "Deshidratación",

        palabras: [
            "sed",
            "boca seca",
            "orina oscura",
            "orina amarilla",
            "mareo",
            "deshidratado",
            "deshidratación"
        ],

        descripcion:
            "Algunos de estos síntomas pueden aparecer cuando una persona no consume suficiente líquido o pierde demasiado.",

        recomendacion:
            "Mantén una hidratación adecuada y consulta con un profesional si los síntomas son importantes o persisten."
    },


    {
        nombre: "Falta de sueño",

        palabras: [
            "cansancio",
            "sueño",
            "somnolencia",
            "no puedo dormir",
            "no duermo",
            "insomnio",
            "agotamiento",
            "fatiga"
        ],

        descripcion:
            "Dormir poco puede relacionarse con cansancio, dificultades de concentración y cambios en el estado de ánimo.",

        recomendacion:
            "Procura mantener horarios regulares de sueño y consulta si las dificultades para dormir persisten."
    },


    {
        nombre: "Estrés o ansiedad",

        palabras: [
            "ansiedad",
            "ansioso",
            "nervios",
            "nervioso",
            "preocupación",
            "preocupado",
            "estrés",
            "estresado",
            "palpitaciones",
            "no puedo concentrarme"
        ],

        descripcion:
            "El estrés y la ansiedad pueden producir síntomas físicos y emocionales.",

        recomendacion:
            "Hablar con un adulto de confianza o un profesional puede ayudar cuando la ansiedad interfiere con la vida diaria."
    },


    {
        nombre: "Problemas de visión",

        palabras: [
            "visión borrosa",
            "veo borroso",
            "no veo",
            "no puedo ver",
            "dolor de cabeza",
            "dificultad para leer",
            "entrecierro los ojos",
            "vista"
        ],

        descripcion:
            "Algunos problemas visuales pueden dificultar la lectura, ver el tablero o provocar molestias.",

        recomendacion:
            "Una evaluación visual puede ayudar a identificar problemas de visión."
    },


    {
        nombre: "Problemas dentales",

        palabras: [
            "dolor de diente",
            "dolor dental",
            "caries",
            "sangrado de encías",
            "sangran las encías",
            "encías",
            "dolor en los dientes",
            "diente"
        ],

        descripcion:
            "Los síntomas relacionados con dientes y encías pueden indicar la necesidad de una valoración odontológica.",

        recomendacion:
            "Mantén una buena higiene dental y consulta con un odontólogo ante dolor o molestias persistentes."
    },


    {
        nombre: "Infección respiratoria",

        palabras: [
            "tos",
            "tos seca",
            "tos con flema",
            "dolor de garganta",
            "garganta",
            "congestión",
            "mocos",
            "nariz tapada",
            "fiebre",
            "resfriado",
            "estornudos"
        ],

        descripcion:
            "Estos síntomas pueden aparecer en diferentes infecciones respiratorias, aunque también pueden tener otras causas.",

        recomendacion:
            "Descansa, mantén una hidratación adecuada y consulta si los síntomas son intensos, persistentes o empeoran."
    },


    {
        nombre: "Dolor de cabeza",

        palabras: [
            "dolor de cabeza",
            "me duele la cabeza",
            "cefalea",
            "migraña",
            "dolor en la cabeza"
        ],

        descripcion:
            "El dolor de cabeza puede tener muchas causas, incluyendo falta de sueño, estrés, deshidratación o problemas visuales.",

        recomendacion:
            "Si el dolor es intenso, repentino, recurrente o se acompaña de síntomas preocupantes, busca atención médica."
    },


    {
        nombre: "Problemas de alimentación",

        palabras: [
            "mala alimentación",
            "no como",
            "como mucho",
            "no tengo apetito",
            "sin apetito",
            "alimentación",
            "comida",
            "no desayuno",
            "me salto comidas"
        ],

        descripcion:
            "Los hábitos alimentarios pueden influir en la energía, crecimiento y bienestar.",

        recomendacion:
            "Una alimentación variada y equilibrada es importante. Si existe una preocupación relacionada con la alimentación, habla con un adulto y un profesional."
    },


    {
        nombre: "Sobrepeso y obesidad",

        palabras: [
            "obesidad",
            "obeso",
            "sobrepeso",
            "peso",
            "engordar",
            "mucho peso"
        ],

        descripcion:
            "El peso corporal debe interpretarse teniendo en cuenta la edad, el crecimiento y otros factores. En niños y adolescentes no debe evaluarse solamente por apariencia.",

        recomendacion:
            "Si existe preocupación por el crecimiento o el peso, es recomendable consultar con un profesional de salud."
    },


    {
        nombre: "Salud emocional",

        palabras: [
            "triste",
            "tristeza",
            "depresión",
            "depresion",
            "no quiero hacer nada",
            "sin ganas",
            "aislado",
            "aislamiento",
            "soledad",
            "llorar mucho"
        ],

        descripcion:
            "Los cambios persistentes del estado de ánimo pueden afectar las actividades escolares, familiares y sociales.",

        recomendacion:
            "Hablar con un adulto de confianza o profesional de salud mental puede ser importante."
    },


    {
        nombre: "Higiene personal",

        palabras: [
            "higiene",
            "aseo",
            "olor corporal",
            "no me baño",
            "manos sucias",
            "uñas sucias"
        ],

        descripcion:
            "La higiene personal incluye hábitos como el lavado de manos, baño, cuidado dental y limpieza de la ropa.",

        recomendacion:
            "Mantener buenos hábitos de higiene puede ayudar a cuidar la salud y prevenir algunos problemas."
    },


    {
        nombre: "Problemas posturales",

        palabras: [
            "dolor de espalda",
            "dolor de cuello",
            "espalda",
            "cuello",
            "postura",
            "mala postura",
            "me duele la espalda"
        ],

        descripcion:
            "Las molestias de espalda o cuello pueden relacionarse con postura, actividad física, cargas u otras causas.",

        recomendacion:
            "Realiza pausas durante el estudio y consulta si el dolor persiste o es intenso."
    },


    {
        nombre: "Actividad física insuficiente",

        palabras: [
            "no hago ejercicio",
            "sedentario",
            "sedentarismo",
            "no hago deporte",
            "poco ejercicio",
            "no me muevo"
        ],

        descripcion:
            "La actividad física regular forma parte de un estilo de vida saludable.",

        recomendacion:
            "Busca oportunidades adecuadas para moverte durante el día, según tus posibilidades y condiciones de salud."
    },


    {
        nombre: "Problemas de piel",

        palabras: [
            "acné",
            "acne",
            "granitos",
            "espinillas",
            "picazón",
            "picazon",
            "piel seca",
            "piel roja",
            "enrojecimiento"
        ],

        descripcion:
            "Durante la etapa escolar pueden aparecer diferentes problemas de piel, como acné, irritación o sequedad.",

        recomendacion:
            "Evita manipular lesiones de la piel y consulta si el problema es persistente, doloroso o empeora."
    },


    {
        nombre: "Bullying y bienestar emocional",

        palabras: [
            "bullying",
            "acoso escolar",
            "me molestan",
            "me insultan",
            "me pegan",
            "me excluyen",
            "acoso",
            "amenazas"
        ],

        descripcion:
            "El acoso escolar puede afectar el bienestar emocional, social y académico.",

        recomendacion:
            "Habla con un adulto de confianza, profesor, orientador escolar o familiar. No tienes que afrontar una situación de acoso solo."
    }

];


/* =========================================
   PALABRAS DE ALERTA
========================================= */

const señalesAlarma = [

    "no puedo respirar",
    "dificultad para respirar",
    "me falta el aire",
    "me desmaye",
    "me desmayé",
    "convulsión",
    "convulsiones",
    "dolor intenso",
    "dolor muy fuerte",
    "dolor repentino",
    "confusión",
    "sangrado abundante",
    "me quiero suicidar",
    "quiero suicidarme",
    "quiero hacerme daño",
    "hacerme daño",
    "suicidio"
];


/* =========================================
   NORMALIZAR TEXTO
========================================= */

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


/* =========================================
   COMPROBAR SEÑALES DE ALERTA
========================================= */

function comprobarAlarma(texto) {

    const textoNormalizado = normalizarTexto(texto);

    return señalesAlarma.some(señal => {

        return textoNormalizado.includes(
            normalizarTexto(señal)
        );

    });
}


/* =========================================
   BUSCAR PROBLEMA
========================================= */

function buscarProblema() {

    const input =
        document.getElementById("symptomInput");

    const resultado =
        document.getElementById("resultado");

    const textoOriginal =
        input.value.trim();


    /* -------------------------------
       VALIDAR ENTRADA
    -------------------------------- */

    if (!textoOriginal) {

        resultado.style.display = "block";

        resultado.innerHTML = `
            <div class="no-result">

                <h3>✏️ Escribe un síntoma o problema</h3>

                <p>
                    Por ejemplo:
                    <strong>
                        "Tengo dolor de cabeza y estoy muy cansado"
                    </strong>
                </p>

            </div>
        `;

        return;
    }


    /* -------------------------------
       COMPROBAR EMERGENCIA
    -------------------------------- */

    if (comprobarAlarma(textoOriginal)) {

        resultado.style.display = "block";

        resultado.innerHTML = `

            <div class="emergency">

                <h3>🚨 Busca ayuda inmediatamente</h3>

                <p>
                    Lo que escribiste contiene una posible
                    señal de alarma.
                </p>

                <p>
                    Si existe una emergencia médica,
                    contacta los servicios de emergencia
                    de tu localidad o busca ayuda de un
                    adulto responsable inmediatamente.
                </p>

                <br>

                <strong>
                    Esta aplicación no puede evaluar
                    emergencias médicas.
                </strong>

            </div>
        `;

        return;
    }


    /* -------------------------------
       NORMALIZAR TEXTO
    -------------------------------- */

    const texto =
        normalizarTexto(textoOriginal);


    /* -------------------------------
       BUSCAR COINCIDENCIAS
    -------------------------------- */

    const coincidencias = [];


    problemas.forEach(problema => {

        let puntos = 0;

        problema.palabras.forEach(palabra => {

            const palabraNormalizada =
                normalizarTexto(palabra);

            if (
                texto.includes(palabraNormalizada)
            ) {
                puntos++;
            }

        });


        if (puntos > 0) {

            coincidencias.push({
                problema: problema,
                puntos: puntos
            });

        }

    });


    /* -------------------------------
       ORDENAR RESULTADOS
    -------------------------------- */

    coincidencias.sort(
        (a, b) => b.puntos - a.puntos
    );


    resultado.style.display = "block";


    /* -------------------------------
       SIN RESULTADOS
    -------------------------------- */

    if (coincidencias.length === 0) {

        resultado.innerHTML = `

            <div class="no-result">

                <h3>🔎 No encontré una coincidencia</h3>

                <p>
                    No encontré un tema educativo
                    relacionado con lo que escribiste
                    dentro de la información disponible
                    en esta aplicación.
                </p>

                <br>

                <p>
                    Esto
                    <strong>
                        no significa que no exista un problema de salud.
                    </strong>
                </p>

                <p>
                    Los mismos síntomas pueden aparecer
                    por diferentes razones.
                </p>

            </div>
        `;

        return;
    }


    /* -------------------------------
       MOSTRAR RESULTADOS
    -------------------------------- */

    let html = `

        <h3>📋 Información relacionada</h3>

        <p>
            Encontramos temas educativos relacionados
            con lo que escribiste:
        </p>

    `;


    coincidencias
        .slice(0, 5)
        .forEach(item => {

            html += `

                <div class="result-card">

                    <h4>
                        ${item.problema.nombre}
                    </h4>

                    <p>
                        ${item.problema.descripcion}
                    </p>

                    <br>

                    <p>
                        <strong>💡 Orientación:</strong>
                        ${item.problema.recomendacion}
                    </p>

                </div>

            `;

        });


    /* -------------------------------
       AVISO FINAL
    -------------------------------- */

    html += `

        <div class="info-result">

            <strong>⚠️ Importante</strong>

            <p>
                Estos resultados son solamente
                información educativa.
                La aplicación no realiza diagnósticos.
            </p>

            <p>
                Si los síntomas persisten, empeoran
                o generan preocupación, consulta con
                un profesional de salud.
            </p>

        </div>

    `;


    resultado.innerHTML = html;

}


/* =========================================
   BUSCAR AL PRESIONAR CTRL + ENTER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("symptomInput");


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    buscarProblema();

                }

            }
        );

    }

});
