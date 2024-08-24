import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reset, setIndex, setQuestions, setScore } from '@/redux/questionSlice';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const { options, score } = useSelector((state: RootState) => state.question);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewQues, setIsLoadingNewQues] = useState(false);
  const [isLoadingRest, setIsLoadingReset] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // if user wants to try same questions again

  const handleTryAgain = async () => {
    try {
      setIsLoading(true);
      dispatch(setIndex(0));
      dispatch(setScore(0));
      setIsLoading(false);
      navigate('/take-quiz');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //if user wants to fetch new questions on same settings

  const handleNewQues = async () => {
    try {
      setIsLoadingNewQues(true);
      dispatch(setIndex(0));
      dispatch(setScore(0));
      let apiUrl = String(import.meta.env.VITE_APIURL);

      apiUrl = `${apiUrl}amount=${options.amount_of_questions}&category=${options.question_category}&difficulty=${options.question_difficulty}&type=${options.question_type}`;

      const response = await axios.get(apiUrl);
      dispatch(setQuestions(response.data.results));

      setIsLoadingNewQues(false);
      navigate('/take-quiz');
    } catch (error) {
      setIsLoadingNewQues(false);
      console.log(error);
    }
  };

  // if user wants to start a fresh quiz

  const handleNewQuiz = async () => {
    try {
      setIsLoadingReset(true);
      dispatch(reset());
      navigate('/');
    } catch (error) {
      setIsLoadingReset(false);
      console.log(error);
    }
  };

  return (
    <main className='flex flex-col items-center justify-center bg-purple-500 min-h-screen container p-2'>
      <Card>
        <CardHeader>
          <CardTitle>Your Final Score : {score}</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 mt-4'>
          <Button onClick={handleTryAgain}>
            {isLoading ? <Loader className='animate-spin' /> : 'Try Again'}
          </Button>
          <Button onClick={handleNewQues}>
            {' '}
            {isLoadingNewQues ? <Loader className='animate-spin' /> : 'Fetch New Questions'}
          </Button>
          <Button onClick={handleNewQuiz}>
            {' '}
            {isLoadingRest ? <Loader className='animate-spin' /> : 'Start New Quiz'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Results;
