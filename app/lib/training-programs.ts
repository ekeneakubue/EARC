import { TrainingStatus } from "./enums";

export type TrainingProgramSeed = {
  id: string;
  title: string;
  cohort: string;
  enrolled: number;
  capacity: number;
  startDate: string;
  status: (typeof TrainingStatus)[keyof typeof TrainingStatus];
};

export const defaultTrainingPrograms: TrainingProgramSeed[] = [
  {
    id: "python-for-data-science-cohort-4",
    title: "Python for Data Science",
    cohort: "Cohort 4",
    enrolled: 42,
    capacity: 50,
    startDate: "2026-07-07",
    status: TrainingStatus.OPEN,
  },
  {
    id: "monitoring-evaluation-methods-cohort-2",
    title: "Monitoring & Evaluation Methods",
    cohort: "Cohort 2",
    enrolled: 35,
    capacity: 40,
    startDate: "2026-07-14",
    status: TrainingStatus.OPEN,
  },
  {
    id: "gis-spatial-analysis-cohort-3",
    title: "GIS & Spatial Analysis",
    cohort: "Cohort 3",
    enrolled: 28,
    capacity: 30,
    startDate: "2026-06-28",
    status: TrainingStatus.FULL,
  },
  {
    id: "spss-for-researchers-cohort-1",
    title: "SPSS for Researchers",
    cohort: "Cohort 1",
    enrolled: 22,
    capacity: 35,
    startDate: "2026-08-04",
    status: TrainingStatus.DRAFT,
  },
];

export function formatTrainingStartDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
