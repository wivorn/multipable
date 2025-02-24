import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Settings, X } from 'lucide-react'

function shuffle(array: number[]) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

const App = () => {
  const [questions, setQuestions] = useState<number[]>(
    shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  )
  const [num1, setNum1] = useState(2)
  const [num2, setNum2] = useState<number>(questions[0])
  const [showSettings, setShowSettings] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateNewProblem = () => {
    setNum2(questions[(score + 1) % questions.length])
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
      if ((score + 1) % questions.length === 0) {
        setQuestions(shuffle(questions))
      }
      setScore(score + 1)
      setStreak(streak + 1)
      setTimeout(generateNewProblem, 500)
    }
  }

  return (
    <>
      <Card
        className="w-full mx-auto p-6 bg-gradient-to-br h-dvh from-blue-50 to-purple-50 absolute top-0 left-0"
        style={{ display: showSettings ? 'block' : 'none' }}
      >
        <CardContent>
          <div className="flex flex-col justify-center items-center text-center mb-8 gap-2">
            <div className="flex justify-center items-center">
              <h1 className="flex text-3xl font-bold text-purple-600 mb-2 align-center mr-2">
                Settings
              </h1>
              <X onClick={() => setShowSettings(false)} />
            </div>
            <button
              className="w-28 text-center text-3xl p-2 rounded-lg bg-purple-400 text-white"
              onClick={() => {
                setNum1(2)
                setShowSettings(false)
              }}
            >
              2
            </button>
            <button
              className="w-28 text-center text-3xl p-2 rounded-lg bg-purple-400 text-white"
              onClick={() => {
                setNum1(3)
                setShowSettings(false)
              }}
            >
              3
            </button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full mx-auto p-6 bg-gradient-to-br h-dvh from-blue-50 to-purple-50">
        <CardContent>
          <div className="text-center mb-8">
            <div className="flex justify-center items-center">
              <h1 className="flex text-3xl font-bold text-purple-600 mb-2 align-center mr-2">
                Multiplable
              </h1>
              <Settings onClick={() => setShowSettings(true)} />
            </div>
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
    </>
  )
}

export default App
