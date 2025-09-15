
import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedContent } from '../types';

// FIX: Initialize GoogleGenAI client according to guidelines, using API_KEY from environment variables directly.
// The API key MUST be provided via `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        titleEs: { type: Type.STRING, description: "Título del artículo en español." },
        titleEn: { type: Type.STRING, description: "Título del artículo en inglés (si existe).", nullable: true },
        authors: {
            type: Type.ARRAY,
            description: "Lista de autores.",
            items: {
                type: Type.OBJECT,
                properties: {
                    givenNames: { type: Type.STRING, description: "Nombres del autor." },
                    surname: { type: Type.STRING, description: "Apellidos del autor." },
                    email: { type: Type.STRING, description: "Email del autor (si se encuentra).", nullable: true },
                    orcid: { type: Type.STRING, description: "ORCID del autor en formato 0000-0000-0000-0000 (si se encuentra).", nullable: true },
                },
                required: ["givenNames", "surname"]
            },
        },
        affiliations: {
            type: Type.ARRAY,
            description: "Lista de afiliaciones. Debe haber al menos una.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Identificador único, ej: 'aff1'." },
                    institution: { type: Type.STRING, description: "Nombre de la institución." },
                    city: { type: Type.STRING, description: "Ciudad." },
                    country: { type: Type.STRING, description: "País." }
                },
                required: ["id", "institution", "city", "country"]
            }
        },
        correspondingEmail: { type: Type.STRING, description: "Email del autor de correspondencia.", nullable: true },
        receivedDate: { type: Type.STRING, description: "Fecha de recepción en formato YYYY-MM-DD.", nullable: true },
        acceptedDate: { type: Type.STRING, description: "Fecha de aceptación en formato YYYY-MM-DD.", nullable: true },
        abstractEs: { type: Type.STRING, description: "Resumen completo en español." },
        abstractEn: { type: Type.STRING, description: "Abstract completo en inglés (si existe).", nullable: true },
        keywordsEs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de palabras clave en español." },
        keywordsEn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de keywords en inglés." },
        sections: {
            type: Type.ARRAY,
            description: "Cuerpo principal del artículo, dividido en secciones como Introducción, Métodos, Resultados, Discusión, etc.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Título de la sección." },
                    content: { type: Type.STRING, description: "Contenido completo de la sección en un solo texto." },
                },
                required: ["title", "content"]
            },
        },
        references: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de referencias bibliográficas, cada una como un string completo." },
        figures: {
            type: Type.ARRAY,
            description: "Lista de figuras mencionadas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID de la figura, ej: 'f1'." },
                    label: { type: Type.STRING, description: "Etiqueta, ej: 'Figura 1'." },
                    caption: { type: Type.STRING, description: "Pie de figura." }
                },
                required: ["id", "label", "caption"]
            }
        },
        tables: {
            type: Type.ARRAY,
            description: "Lista de tablas mencionadas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID de la tabla, ej: 't1'." },
                    label: { type: Type.STRING, description: "Etiqueta, ej: 'Tabla 1'." },
                    caption: { type: Type.STRING, description: "Título o pie de tabla." }
                },
                required: ["id", "label", "caption"]
            }
        },
        articleType: { type: Type.STRING, description: "Tipo de artículo, ej: 'research-article', 'review-article'.", nullable: true }
    },
    required: ["titleEs", "authors", "affiliations", "abstractEs", "keywordsEs", "sections", "references"]
};

export async function extractArticleStructure(text: string): Promise<ExtractedContent> {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Eres un experto en el estándar de publicación académica SciELO JATS (SPS 1.9).
    Analiza el siguiente texto extraído de un documento científico y conviértelo en una estructura JSON que siga el esquema proporcionado.
    Extrae la mayor cantidad de información posible de manera precisa. Combina párrafos de una misma sección en un solo string para el campo "content".
    Identifica nombres y apellidos de los autores correctamente. Si no hay afiliaciones, crea una con valores de ejemplo como "[Institución pendiente]".

    Texto del artículo:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as ExtractedContent;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("La IA no pudo procesar el documento. Intenta con un documento mejor estructurado.");
  }
}
