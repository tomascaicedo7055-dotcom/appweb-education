const problemas = [
    {
        nombre: "Deshidratación",
        palabras: ["sed", "boca seca", "orina oscura", "mareo", "deshidratado"],
        descripcion: "Algunos de los síntomas escritos pueden aparecer cuando una persona no consume suficiente líquido o pierde demasiado."
    },
    {
        nombre: "Falta de sueño",
        palabras: ["cansancio", "sueño", "somnolencia", "no puedo dormir", "insomnio", "agotamiento"],
        descripcion: "El cansancio y las dificultades de concentración pueden estar relacionados con dormir poco, aunque también pueden tener otras causas."
    },
    {
        nombre: "Estrés o ansiedad",
        palabras: ["ansiedad", "nervios", "nervioso", "preocupación", "estrés", "palpitaciones", "no puedo concentrarme"],
        descripcion: "El estrés y la ansiedad pueden producir síntomas físicos y emocionales. Si son persistentes o interfieren con la vida diaria, conviene buscar ayuda."
    },
    {
        nombre: "Problemas de visión",
        palabras: ["visión borrosa", "veo borroso", "no veo", "dolor de cabeza", "dificultad para leer", "entrecierro los ojos"],
        descripcion: "Las dificultades visuales pueden provocar problemas para leer, ver el tablero o dolores de cabeza."
    },
    {
        nombre: "Problemas dentales",
        palabras: ["dolor de diente", "dolor dental", "caries", "sangrado de encías", "encías", "dolor en los dientes"],
        descripcion: "Los síntomas relacionados con dientes o encías pueden requerir una valoración odontológica."
    },
    {
        nombre: "Infección respiratoria",
        palabras: ["tos", "dolor de garganta", "congestión", "mocos", "fiebre", "resfriado"],
        descripcion: "Estos síntomas pueden aparecer en diferentes infecciones respiratorias, pero también pueden tener otras causas."
    },
    {
        nombre: "Dolor de cabeza",
        palabras: ["dolor de cabeza", "me duele la cabeza", "cefalea", "migraña"],
        descripcion: "El dolor de cabeza puede tener múltiples causas. Si es intenso, repentino, recurrente o se acompaña de otros síntomas importantes, busca atención médica."
    },
    {
        nombre: "Problemas de alimentación",
        palabras: ["mala alimentación", "no como", "como mucho", "no tengo apetito", "alimentación", "comida"],
        descripcion: "Los hábitos alimentarios pueden influir en la energía, crecimiento y bienestar. Una evaluación profesional puede ser útil si existen preocupaciones."
    },
    {
        nombre: "Salud emocional",
        palabras: ["triste", "tristeza", "depresión", "no quiero hacer nada", "sin ganas", "aislado", "soledad"],
        descripcion: "Los cambios persistentes del estado de ánimo merecen atención. Hablar con un adulto de confianza o profesional de salud mental puede ser importante."
    },
    {
        nombre: "Higiene personal",
        palabras: ["higiene", "aseo", "olor", "no me baño", "manos sucias"],
        descripcion: "La higiene personal incluye hábitos como el lavado de manos, baño, cuidado dental y limpieza de la ropa."
    },
    {
        nombre: "Problemas posturales",
        palabras: ["dolor de espalda", "dolor de cuello", "espalda", "cuello", "postura"],
        descripcion: "Las molestias de espalda o cuello pueden relacionarse con postura, actividad física, cargas u otras causas."
    },
    {
        nombre: "Actividad física insuficiente",
        palabras: ["no hago ejercicio", "sedentario", "sedentarismo", "no hago deporte", "poco ejercicio"],
        descripcion: "La actividad física forma parte de un estilo de vida saludable y puede contribuir al bienestar físico y mental."
    }
];

function buscarProblema() {
    const texto = document.getElementById("symptomInput").value.toLowerCase().trim();
    const resultado = document.getElementById("resultado");

    if (!texto) {
        resultado.innerHTML = `
            <div class="result-card">
                <h3>✏️ Escribe un síntoma o problema</h3>
                <p>Por ejemplo: <strong>"tengo dolor de cabeza y estoy muy cansado"</strong>.</p>
            </div>
        `;
        return;
    }

    let coincidencias = [];

    problemas.forEach((problema) => {
        let puntos = 0;

        problema.palabras.forEach((palabra) => {
            if (texto.includes(palabra)) {
                puntos++;
            }
        });

        if (puntos > 0) {
            coincidencias.push({ problema, puntos });
        }
    });

    coincidencias.sort((a, b) => b.puntos - a.puntos);

    if (coincidencias.length === 0) {
        resultado.innerHTML = `
            <div class="result-card">
                <h3>🔎 No encontré una coincidencia clara</h3>
                <p>La información escrita no coincide con los temas educativos incluidos en esta versión.</p>
                <p><strong>Esto no significa que no exista un problema de salud.</strong> Los síntomas pueden tener muchas causas.</p>
                <p>Si el síntoma persiste, empeora o te preocupa, consulta con un profesional sanitario.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="result-card">
            <h3>📋 Información relacionada</h3>
            <p>Encontré estos temas relacionados con lo que escribiste:</p>
        </div>
    `;

    coincidencias.slice(0, 4).forEach((item) => {
        html += `
            <div class="result-card">
                <h4 style="color:#0e7490; margin-bottom:8px;">${item.problema.nombre}</h4>
                <p>${item.problema.descripcion}</p>
            </div>
        `;
    });

    html += `
        <div class="result-card">
            <p><strong>⚠️ Recuerda:</strong> esto es una coincidencia educativa y <strong>no es un diagnóstico médico</strong>.</p>
            <p>Un mismo síntoma puede aparecer en diferentes condiciones. Si tienes síntomas persistentes o preocupantes, consulta con un profesional de salud.</p>
        </div>
    `;

    resultado.innerHTML = html;
}
