import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  options: {
    loading: false,
    question_category: ``,
    question_difficulty: ``,
    question_type: ``,
    amount_of_questions: 20,
  },
  questions: [],
  index: 0,
  score: 0,
};

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    changeLoading: (state) => {
      state.options.loading = !state.options.loading;
    },

    changeCategory: (state, action) => {
      state.options.question_category = action.payload;
    },

    changeDifficulty: (state, action) => {
      state.options.question_difficulty = action.payload;
    },

    changeType: (state, action) => {
      state.options.question_type = action.payload;
    },

    changeAmountOfuQues: (state, action) => {
      state.options.amount_of_questions = action.payload;
    },

    setQuestions: (state, action) => {
      state.questions = action.payload;
    },

    setIndex: (state, action) => {
      state.index = action.payload;
    },

    setScore: (state, action) => {
      state.score = action.payload;
    },

    reset: () => {
      return initialState;
    },
  },
});

export const {
  changeLoading,
  changeCategory,
  changeDifficulty,
  changeType,
  changeAmountOfuQues,
  setIndex,
  setQuestions,
  setScore,
  reset,
} = questionSlice.actions;

export default questionSlice.reducer;
