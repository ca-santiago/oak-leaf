import HorizontalWeekDaysView from "@/components/calendar/horizontalWeekView";
import { DATE_FORMAT } from "@/core/constants";
import TaskService from "@/services/tasks";
import { getSession } from "@auth0/nextjs-auth0";
import moment from "moment";
import HabitDetails from "./details";
import { HabitService } from "@/services/habits";

interface Params {
  id: string;
}

const HabitDetailsPage = async (args: { params: Params }) => {
  const { id: habitId } = args.params;

  const session = await getSession();
  const { accessToken } = session!;

  const [tasks, habit] = await Promise.all([
    TaskService.getByHabitId(accessToken!, habitId),
    HabitService.getById(accessToken!, habitId),
  ]);

  return <HabitDetails habit={habit} token={accessToken!} tasks={tasks} />;
};

export default HabitDetailsPage;
