import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const App = () => {
  const [num1, setNum1] = useState(2)
  const [num2, setNum2] = useState(2)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateNewProblem = () => {
    // Generate numbers between 2 and 12 for times tables practice
    const newNum1 = 2
    const newNum2 = Math.floor(Math.random() * 11) + 2
    setNum1(newNum1)
    setNum2(newNum2)
    setUserAnswer('')
    setFeedback('')
    inputRef.current?.focus()
  }

  const checkAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value
    setUserAnswer(answer)

    if (!answer) return

    const correctAnswer = num1 * num2
    const userGuess = parseInt(answer)

    if (userGuess === correctAnswer) {
      setFeedback('Correct! Great job! 🎉')
      setScore(score + 1)
      setStreak(streak + 1)
      setTimeout(generateNewProblem, 500)
    }
  }

  return (
    <Card className="w-full mx-auto p-6 bg-gradient-to-br h-dvh from-blue-50 to-purple-50">
      <CardContent>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            Multiplable
          </h1>
          <div className="flex justify-center items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            {score}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-700 mb-8">
            {num1} × {num2} = ?
          </div>
          <input
            type="tel"
            ref={inputRef}
            value={userAnswer}
            onChange={checkAnswer}
            onFocus={() => window.scrollTo(0, 0)}
            className="w-32 text-center text-6xl p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 font-bold text-gray-700"
            placeholder="?"
            autoFocus
          />
        </div>

        {feedback && (
          <div
            className={`text-center text-xl ${
              feedback.includes('Correct')
                ? 'text-green-600'
                : 'text-orange-500'
            }`}
          >
            {feedback}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default App
