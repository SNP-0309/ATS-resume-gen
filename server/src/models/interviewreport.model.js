import mongoose from "mongoose";

const technicalQuestionschema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question are required."],
    },
    intension: {
      type: String,
      required: [true, "intension are required."],
    },
    answer: {
      type: String,
      required: [true, "Answer required."],
    },
  },
  {
    _id: false,
  },
);
const behavioralQustionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question are required."],
    },
    intension: {
      type: String,
      required: [true, "intension are required."],
    },
    answer: {
      type: String,
      required: [true, "Answer required."],
    },
  },
  {
    _id: false,
  },
);
const skillGapsschema = new mongoose.Schema(
  {
    Skill: {
      type: String,
      required: [true, "Skill is required."],
    },
    severity: {
      type: String,
      require: [true, "Severity is required."],
    },
  },
  {
    id: false,
  },
);
const preparationplanschema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required."],
  },
  focus: {
    type: string,
    required: [true, "Focus is required."],
  },
  tasks: [
    {
      type: string,
      required: [true, "Task is required."],
    },
  ],
});

const interviewreportschema = new mongoose.Schema({
  jobdiscription: {
    type: String,
    required: [true, "job  Discription is required."],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    typr: String,
  },
  matchscore: {
    type: Number,
    min: 0,
    max: 100,
  },
  tecchnicalquestion: [technicalQuestionschema],
  behavioralquestions: [behavioralQustionSchema],
  Skillgaps: [skillGapsschema],
  preparationplan: [preparationplanschema],
},{
    timestamps:true
});
const interviewreportModel =mongoose.model("interviewReport",interviewreportschema) 

export default interviewreportModel
