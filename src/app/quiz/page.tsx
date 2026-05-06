"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Lightbulb, TrendingUp, Users, DollarSign, Building2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function QuizPage() {
  const { t } = useI18n();

  const quizQuestions = [
    {
      id: 1,
      question: t.quizPage.q1,
      icon: <DollarSign className="h-8 w-8 text-[#FFC107]" />,
      options: [
        { text: t.quizPage.q1o1, value: "C-Corp" as const },
        { text: t.quizPage.q1o2, value: "neutral" as const },
        { text: t.quizPage.q1o3, value: "LLC" as const },
      ],
    },
    {
      id: 2,
      question: t.quizPage.q2,
      icon: <TrendingUp className="h-8 w-8 text-[#FFC107]" />,
      options: [
        { text: t.quizPage.q2o1, value: "C-Corp" as const },
        { text: t.quizPage.q2o2, value: "LLC" as const },
        { text: t.quizPage.q2o3, value: "LLC" as const },
      ],
    },
    {
      id: 3,
      question: t.quizPage.q3,
      icon: <Users className="h-8 w-8 text-[#FFC107]" />,
      options: [
        { text: t.quizPage.q3o1, value: "C-Corp" as const },
        { text: t.quizPage.q3o2, value: "neutral" as const },
        { text: t.quizPage.q3o3, value: "LLC" as const },
      ],
    },
    {
      id: 4,
      question: t.quizPage.q4,
      icon: <Building2 className="h-8 w-8 text-[#FFC107]" />,
      options: [
        { text: t.quizPage.q4o1, value: "LLC" as const },
        { text: t.quizPage.q4o2, value: "neutral" as const },
        { text: t.quizPage.q4o3, value: "C-Corp" as const },
      ],
    },
    {
      id: 5,
      question: t.quizPage.q5,
      icon: <Users className="h-8 w-8 text-[#FFC107]" />,
      options: [
        { text: t.quizPage.q5o1, value: "LLC" as const },
        { text: t.quizPage.q5o2, value: "neutral" as const },
        { text: t.quizPage.q5o3, value: "neutral" as const },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<("LLC" | "C-Corp" | "neutral")[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: "LLC" | "C-Corp" | "neutral") => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const getRecommendation = () => {
    const llcCount = answers.filter((a) => a === "LLC").length;
    const cCorpCount = answers.filter((a) => a === "C-Corp").length;

    if (cCorpCount > llcCount) {
      return {
        type: "C-Corp",
        title: t.quizPage.ccorpTitle,
        description: t.quizPage.ccorpDesc,
        benefits: [t.quizPage.ccorpB1, t.quizPage.ccorpB2, t.quizPage.ccorpB3, t.quizPage.ccorpB4, t.quizPage.ccorpB5],
      };
    } else if (llcCount > cCorpCount) {
      return {
        type: "LLC",
        title: t.quizPage.llcTitle,
        description: t.quizPage.llcDesc,
        benefits: [t.quizPage.llcB1, t.quizPage.llcB2, t.quizPage.llcB3, t.quizPage.llcB4, t.quizPage.llcB5],
      };
    } else {
      return {
        type: "LLC",
        title: t.quizPage.neutralTitle,
        description: t.quizPage.neutralDesc,
        benefits: [t.quizPage.neutralB1, t.quizPage.neutralB2, t.quizPage.neutralB3, t.quizPage.neutralB4, t.quizPage.neutralB5],
      };
    }
  };

  const recommendation = showResult ? getRecommendation() : null;

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#FFC107]/10 via-white to-white dark:from-[#FFD54F]/5 dark:via-[#0a0a0a] dark:to-[#0a0a0a]">
      <div className="w-full max-w-3xl">
        {!showResult ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {t.quizPage.questionOf} {currentQuestion + 1} {t.quizPage.of} {quizQuestions.length}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-500">{Math.round(progress)}{t.quizPage.complete}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFC107] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                {quizQuestions[currentQuestion].icon}
                <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                  {quizQuestions[currentQuestion].question}
                </h1>
              </div>

              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option.value;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left font-semibold text-lg ${
                        isSelected
                          ? "bg-[#FFC107] border-[#FFC107] text-black"
                          : "bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-700 hover:border-[#FFC107] dark:hover:border-[#FFC107] hover:bg-[#FFC107]/10 text-black dark:text-white"
                      }`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {currentQuestion > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t.quizPage.prevQuestion}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFC107] rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                {recommendation?.title}
              </h1>
            </div>

            <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {recommendation?.description}
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-xl text-black dark:text-white mb-4">{t.quizPage.keyBenefits}</h3>
                {recommendation?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="h-4 w-4 text-black"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  localStorage.setItem("quiz_entity_type", recommendation?.type || "LLC");
                  localStorage.setItem("from_quiz", "true");
                  window.location.href = "/onboarding";
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
              >
                {t.quizPage.continueWith} {recommendation?.type} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setShowResult(false);
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-[#171717] hover:bg-gray-100 dark:hover:bg-[#0a0a0a] text-black dark:text-white font-bold rounded-xl border-2 border-black dark:border-white transition-all"
              >
                {t.quizPage.retakeQuiz}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/onboarding" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
            {t.quizPage.backToOnboarding}
          </Link>
        </div>
      </div>
    </div>
  );
}
