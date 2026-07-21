import { faqs } from "@/data/faqs";
import { chatbotFallback, chatbotResponses } from "@/data/chatbot-responses";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreMatch(input: string, keywords: string[]): number {
  const words = normalize(input).split(" ");
  let score = 0;
  for (const keyword of keywords) {
    const kw = normalize(keyword);
    if (normalize(input).includes(kw)) score += kw.split(" ").length * 2;
    for (const word of words) {
      if (word === kw || word.startsWith(kw) || kw.startsWith(word)) score += 1;
    }
  }
  return score;
}

export function getChatbotReply(userMessage: string): string {
  const input = normalize(userMessage);
  if (!input) return chatbotFallback;

  let bestScore = 0;
  let bestAnswer = "";

  for (const item of chatbotResponses) {
    const score = scoreMatch(input, item.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  for (const faq of faqs) {
    const questionWords = normalize(faq.question).split(" ");
    const answerWords = normalize(faq.answer).split(" ");
    let score = 0;

    for (const word of input.split(" ")) {
      if (word.length < 3) continue;
      if (questionWords.some((qw) => qw.includes(word) || word.includes(qw))) score += 2;
      if (answerWords.some((aw) => aw.includes(word))) score += 1;
    }

    if (normalize(faq.question).includes(input) || input.includes(normalize(faq.question).slice(0, 20))) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = faq.answer;
    }
  }

  if (bestScore >= 2) return bestAnswer;
  return chatbotFallback;
}

export function getSuggestedQuestions(): string[] {
  return [
    "Where is my tracking number?",
    "How long does delivery take?",
    "How do I leave a review?",
    "Do I need to pay customs?",
    "Talk to support on WhatsApp",
  ];
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
