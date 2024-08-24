import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IOption } from '@/types';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeAmountOfuQues,
  changeCategory,
  changeDifficulty,
  changeType,
  setQuestions,
} from '@/redux/questionSlice';
import { RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [questionCategory, setQuestionCategory] = useState('');
  const [questionOptions, setQuestionOptions] = useState<IOption[] | null>(null);
  const [questionDifficulty, setQuestionDifficulty] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  console.log(questionCategory);
  console.log(questionCount);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await axios.get(String(import.meta.env.VITE_APIMAINURI));

      setQuestionOptions(response.data.trivia_categories);
    };

    fetchAPI();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    dispatch(changeCategory(questionCategory));
    dispatch(changeDifficulty(questionDifficulty));
    dispatch(changeType(questionType));
    dispatch(changeAmountOfuQues(questionCount));

    try {
      let apiUrl = String(import.meta.env.VITE_APIURL);

      if (questionCount) {
        apiUrl = apiUrl.concat(`amount=${questionCount}`);
      }

      if (questionCategory.length) {
        apiUrl = apiUrl.concat(`&category=${questionCategory}`);
      }

      if (questionDifficulty.length > 2) {
        apiUrl = apiUrl.concat(`&difficulty=${questionDifficulty}`);
      }

      if (questionType.length > 2) {
        apiUrl = apiUrl.concat(`&type=${questionType}`);
      }

      console.log(apiUrl);

      const response = await axios.get(apiUrl);
      dispatch(setQuestions(response.data.results));

      setIsLoading(false);
      navigate('/take-quiz');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const { options } = useSelector((state: RootState) => state.question);

  const { questions } = useSelector((state: RootState) => state.question);
  console.log(questions);
  console.log(options);

  return (
    <main className='flex flex-col items-center bg-purple-500 min-h-screen container '>
      <h2 className='mt-3 text-3xl md:text-5xl font-medium'>Quiz App</h2>

      {/* category field */}
      <Label htmlFor='category' className='m-3'>
        Category :
      </Label>
      <select value={questionCategory} onChange={(e) => setQuestionCategory(e.target.value)}>
        <option>All</option>
        {questionOptions &&
          questionOptions.length > 0 &&
          questionOptions.map((option: IOption) => (
            <option value={option.id} key={option.id}>
              {option.name}
            </option>
          ))}
      </select>

      {/* Difficulty field */}
      <Label htmlFor='difficulty' className='m-3'>
        Difficulty :
      </Label>

      <Select
        onValueChange={(value) => setQuestionDifficulty(value)}
        name='difficulty'
        value={questionDifficulty}
      >
        <SelectTrigger className='w-3/4 md:w-1/2'>
          <SelectValue aria-label={questionDifficulty}>{questionDifficulty}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=' '>Any Difficulty </SelectItem>
          <SelectItem value='easy'>Easy</SelectItem>
          <SelectItem value='medium'>Medium</SelectItem>
          <SelectItem value='hard'>Hard</SelectItem>
        </SelectContent>
      </Select>

      {/* Question Type */}
      <Label htmlFor='type' className='m-3'>
        Question Type :
      </Label>

      <Select onValueChange={(value) => setQuestionType(value)} name='type' value={questionType}>
        <SelectTrigger className='w-3/4 md:w-1/2'>
          <SelectValue aria-label={questionType}>{questionType}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=' '>Any Type</SelectItem>
          <SelectItem value='multiple'>Multiple Choice</SelectItem>
          <SelectItem value='boolean'>True/False</SelectItem>
        </SelectContent>
      </Select>

      {/* no. of questions */}
      <Label htmlFor='questionCount' className='m-3'>
        Number of Questions :
      </Label>

      <Input
        id='questionCount'
        type='number'
        className='w-3/4 md:w-1/2'
        value={questionCount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuestionCount(Number(e.target.value))
        }
        min={10}
        max={50}
      />

      <Button className='m-5 w-2/5 md:w-2/5' onClick={handleSubmit}>
        Take Quiz
      </Button>
    </main>
  );
};

export default HomePage;
