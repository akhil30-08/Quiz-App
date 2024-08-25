import { decodeString, getRandomInt } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { IQuestion } from '@/types';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { setIndex, setScore } from '@/redux/questionSlice';
import { useNavigate } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';

const QuizPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { questions, score, index } = useSelector((state: RootState) => state.question);

  const [options, setOptions] = useState<string[]>([]);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(12);

  useEffect(() => {
    // Check if the index is out of bounds
    if (index >= questions.length) {
      navigate('/results');
      return; // Early exit from useEffect to prevent further execution
    }

    const question: IQuestion = questions[index];
    if (question) {
      const answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length + 1),
        0,
        question.correct_answer
      );
      setOptions(answers);
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          dispatch(setIndex(index + 1));
          // Reset timer for the next question
          setTimeLeft(12);
          return 12;
        }
      });
    }, 1000);
    // Cleanup timer on component unmount or when question changes
    return () => clearInterval(interval);
  }, [index, questions, navigate, dispatch]);

  const handleListItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnswerSelected(true);
    const selectedText = event.currentTarget.textContent;
    const question: IQuestion = questions[index];

    if (selectedText) {
      setSelectedAnswer(selectedText);

      // Set score if the answer is correct
      if (selectedText === question?.correct_answer) {
        setIsCorrect(true);
        dispatch(setScore(score + 1));
      } else {
        setIsCorrect(false);
      }

      // Check if we are on the last question
      if (index < questions.length) {
        setTimeout(() => {
          setAnswerSelected(false);
          setSelectedAnswer(null);
          dispatch(setIndex(index + 1));
          setTimeLeft(12);
        }, 2000);
      } else {
        setTimeout(() => {
          setAnswerSelected(false);
          setSelectedAnswer(null);
          navigate('/results');
        }, 2000);
      }
    }
  };

  if (index >= questions.length) {
    return null; // Avoid rendering if we are navigating away
  }

  const question: IQuestion = questions[index]; // Get the question after all checks

  return (
    <main className='flex flex-col items-center justify-center bg-purple-500 min-h-screen container p-2'>
      {!questions.length ? (
        <h3 className='text-xl flex flex-col'>
          Please Wait.....
          <>
            <Loader2 className='animate-spin' />
          </>
        </h3>
      ) : (
        <>
          <Card className='p-2 w-full max-w-xl md:max-w-lg'>
            <CardHeader>
              <CardDescription className='text-center'>Question {index + 1}</CardDescription>

              <CardTitle className='text-slate-700 text-base md:text-2xl text-center'>
                {decodeString(question.question)}
              </CardTitle>

              <CardDescription className='text-red-600 text-sm font-semibold flex'>
                <Clock className='me-2' /> Left : {timeLeft} seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {options.map((option, i) => {
                  // Determine the background color based on the answer state
                  let bgColor = 'bg-zinc-200'; // Default color
                  if (answerSelected) {
                    if (option === selectedAnswer) {
                      bgColor = isCorrect ? 'bg-green-500' : 'bg-red-500'; // Correct or Incorrect
                    } else if (option === question.correct_answer) {
                      bgColor = 'bg-green-500'; // Highlight correct answer
                    }
                  }

                  return (
                    <li
                      key={i}
                      className={`p-1 rounded-lg m-2 cursor-pointer text-center ${bgColor}  
                      `}
                      onClick={handleListItemClick}
                    >
                      {decodeString(option)}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter className='flex justify-center'>
              Score: {score} / {questions.length}
            </CardFooter>
          </Card>
        </>
      )}
    </main>
  );
};

export default QuizPage;
