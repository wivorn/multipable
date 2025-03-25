import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Settings, X } from 'lucide-react'
import clsx from 'clsx'

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

const ROUND_TIME_SECOND = 60

const App = () => {
  const [questions, setQuestions] = useState<number[]>(
    shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  )
  const [num1, setNum1] = useState(2)
  const [num2, setNum2] = useState(-1)
  const [showSettings, setShowSettings] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [showStart, setShowStart] = useState(true)
  const [remainingTime, setRemainingTime] = useState(ROUND_TIME_SECOND)
  const [highScore, setHighScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (remainingTime === 0) {
      clearInterval(timerRef.current as NodeJS.Timeout)
      setShowStart(true)
      setRemainingTime(ROUND_TIME_SECOND)
      setHighScore(Math.max(score, highScore))
      setFeedback('Time is up! Your score is: ' + score)
      setScore(0)
    }
  }, [remainingTime, highScore, score])

  const resetQuestions = () => {
    setQuestions(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]))
  }

  const generateNewProblem = (score: number) => {
    setNum2(questions[score % questions.length])
    setUserAnswer('')
    setFeedback('')
    inputRef.current?.focus()
  }

  const checkAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    // format only numbers
    const reg = /^[0-9\b]+$/
    if (e.target.value !== '' && !reg.test(e.target.value)) {
      return
    }
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
      setTimeout(() => generateNewProblem(score + 1), 300)
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
            {[2, 3].map((n) => (
              <button
                className={clsx(
                  'w-28 text-center text-3xl p-2 rounded-lg border-purple-400 text-purple-500 border-2 hover:bg-purple-500 hover:text-white',
                  num1 === n && 'bg-purple-500 text-white'
                )}
                onClick={() => {
                  setNum1(n)
                  setScore(0)
                  setHighScore(0)
                  resetQuestions()
                  generateNewProblem(0)
                  setShowSettings(false)
                }}
              >
                {n}
              </button>
            ))}
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
          {!showStart && (
            <div className="absolute top-5 right-5">Timer: {remainingTime}</div>
          )}
          <div className="absolute top-5 left-5 flex">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            {highScore}
          </div>
          {!showStart && (
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
          )}
          <div className="text-center mb-8">
            {showStart && (
              <button
                className="w-32 text-center text-3xl p-2 rounded-lg bg-purple-400 text-white"
                onClick={() => {
                  setScore(0)
                  generateNewProblem(0)
                  setShowStart(false)
                  timerRef.current = setInterval(() => {
                    setRemainingTime((prev) => prev - 1)
                  }, 1000)
                }}
              >
                Start
              </button>
            )}
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
