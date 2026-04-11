'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, CircleCheck as CheckCircle2, Circle as HelpCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'What type of business are you starting?',
    options: ['E-commerce', 'SaaS', 'Services', 'Physical Product', 'Other']
  },
  {
    id: 2,
    question: 'Are you planning to raise venture capital?',
    options: ['Yes, definitely', 'Maybe in the future', 'No', 'Not sure']
  },
  {
    id: 3,
    question: 'How many owners/founders will your company have?',
    options: ['Just me (1)', '2 founders', '3-5 founders', 'More than 5']
  },
  {
    id: 4,
    question: "What's your expected annual revenue in year one?",
    options: ['Under $50k', '$50k - $250k', '$250k - $1M', 'Over $1M']
  },
  {
    id: 5,
    question: 'Which is more important to you?',
    options: ['Simple structure and tax benefits', 'Ability to raise investor funding', 'Maximum legal protection', 'Not sure']
  }
];

export default function BusinessTools() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000);
  const [platformFee, setPlatformFee] = useState(10);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const getRecommendation = () => {
    const raiseVC = answers[1];
    const founders = answers[2];
    const revenue = answers[3];

    if (raiseVC === 'Yes, definitely' || revenue === 'Over $1M') {
      return 'C-Corp';
    }
    return 'LLC';
  };

  const monthlyPlatformFees = (monthlyRevenue * platformFee) / 100;
  const potentialMonthlySavings = monthlyPlatformFees * 0.65;
  const annualSavings = potentialMonthlySavings * 12;

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.05)_0%,transparent_50%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle className="w-4 h-4 text-black" />
            <span className="text-sm font-bold text-black uppercase tracking-wide">Business Planning Tools</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
            Make Informed Decisions
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Use our free tools to help you make the right choices for your business
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

          {/* Left Card - LLC vs C-Corp Quiz */}
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="border-b-2 border-black bg-[#FFC107]">
              <CardTitle className="text-2xl font-bold text-black">
                Not Sure If You Need an LLC or C-Corp?
              </CardTitle>
              <CardDescription className="text-black/70 text-base font-medium">
                Answer 5 quick questions and we'll recommend the right entity type for your business goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {!showResult ? (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-sm font-semibold text-black whitespace-nowrap">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <div className="flex-1 flex gap-1">
                      {questions.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            idx <= currentQuestion ? 'bg-[#FFC107]' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-6">
                      {questions[currentQuestion].question}
                    </h3>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-all duration-200 font-medium text-gray-700 hover:text-black"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center py-8">
                  <div className="w-16 h-16 bg-[#FFC107] rounded-full flex items-center justify-center mx-auto border-2 border-black">
                    <CheckCircle2 className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-2">
                      We Recommend: {getRecommendation()}
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Based on your answers, {getRecommendation() === 'LLC'
                        ? 'an LLC offers the flexibility and tax benefits you need'
                        : 'a C-Corp is better suited for raising venture capital and scaling'}
                    </p>
                  </div>
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-2 border-black hover:bg-black hover:text-white"
                  >
                    Start Over
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Card - Platform Fee Calculator */}
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="border-b-2 border-black bg-[#FFF9E0]">
              <CardTitle className="text-2xl font-bold text-black">
                How Much Are Platform Fees Costing You?
              </CardTitle>
              <CardDescription className="text-black/70 text-base font-medium">
                See how much you could save by accepting payments directly through Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">

              {/* Monthly Revenue Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-black">
                    Monthly Revenue through Platforms
                  </Label>
                  <span className="text-2xl font-bold text-black">
                    ${monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[monthlyRevenue]}
                  onValueChange={(value) => setMonthlyRevenue(value[0])}
                  min={1000}
                  max={50000}
                  step={500}
                  className="[&_[role=slider]]:bg-[#FFC107] [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_.bg-primary]:bg-black"
                />
                <p className="text-sm text-gray-600">
                  Revenue from Teachable, Gumroad, Substack, etc.
                </p>
              </div>

              {/* Platform Fee Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-black">
                    Current Platform Fee
                  </Label>
                  <span className="text-2xl font-bold text-black">
                    {platformFee}%
                  </span>
                </div>
                <Slider
                  value={[platformFee]}
                  onValueChange={(value) => setPlatformFee(value[0])}
                  min={2}
                  max={30}
                  step={1}
                  className="[&_[role=slider]]:bg-[#FFC107] [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_.bg-primary]:bg-black"
                />
              </div>

              {/* Results */}
              <div className="pt-6 border-t-2 border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Monthly Platform Fees</span>
                  <span className="text-xl font-bold text-red-600 line-through">
                    ${monthlyPlatformFees.toFixed(0)}
                  </span>
                </div>
                <div className="bg-[#FFC107]/10 border-2 border-[#FFC107] rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-black mb-2">
                      YOUR POTENTIAL MONTHLY SAVINGS
                    </p>
                    <p className="text-5xl font-bold text-black mb-1">
                      ${potentialMonthlySavings.toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      ${annualSavings.toFixed(0)}/year saved
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold text-base py-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Start Saving Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
