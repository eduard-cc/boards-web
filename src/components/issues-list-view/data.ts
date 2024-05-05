import {
  ChevronDownIcon,
  ChevronUpIcon,
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { EqualIcon } from "lucide-react";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";

export const statuses = [
  {
    value: "TO_DO",
    label: "To Do",
    icon: CircleIcon,
    color: "text-foreground",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: StopwatchIcon,
    color: "text-sky-800 dark:text-sky-600",
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
    color: "text-green-800 dark:text-green-600",
  },
  {
    value: "CANCELED",
    label: "Canceled",
    icon: CrossCircledIcon,
    color: "text-red-800 dark:text-red-600",
  },
];

export const priorities = [
  {
    value: "HIGHEST",
    label: "Highest",
    icon: DoubleArrowUpIcon,
    color: "text-red-800 dark:text-red-600",
    bgColor: "bg-red-500/20 text-red-950 dark:bg-red-500/40 dark:text-red-200",
  },
  {
    value: "HIGH",
    label: "High",
    icon: ChevronUpIcon,
    color: "text-orange-800 dark:text-orange-600",
    bgColor:
      "bg-orange-500/20 text-orange-950 dark:bg-orange-500/40 dark:text-orange-200",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: EqualIcon,
    color: "text-yellow-800 dark:text-yellow-600",
    bgColor:
      "bg-yellow-500/20 text-yellow-950 dark:bg-yellow-500/40 dark:text-yellow-200",
  },
  {
    value: "LOW",
    label: "Low",
    icon: ChevronDownIcon,
    color: "text-green-800 dark:text-green-600",
    bgColor:
      "bg-green-500/20 text-green-950 dark:bg-green-500/40 dark:text-green-200",
  },
  {
    value: "LOWEST",
    label: "Lowest",
    icon: DoubleArrowDownIcon,
    color: "text-teal-800 dark:text-teal-600",
    bgColor:
      "bg-teal-500/20 text-teal-950 dark:bg-teal-500/40 dark:text-teal-200",
  },
];

export const types = [
  {
    value: "TASK",
    label: "Task",
    icon: taskSvg,
    color: "text-cyan-800 dark:text-cyan-600",
  },
  {
    value: "EPIC",
    label: "Epic",
    icon: epicSvg,
    color: "text-purple-800 dark:text-purple-600",
  },
  {
    value: "BUG",
    label: "Bug",
    icon: bugSvg,
    color: "text-red-800 dark:text-red-600",
  },
];
