import TaskService from "@/services/tasks";
import { getSession } from "@auth0/nextjs-auth0";
import HabitDetails from "./details";
import { getHabitById } from "@/services/habits";

interface Params {
  id: string;
}

const HabitDetailsPage = async (args: { params: Params }) => {
  const { id: habitId } = args.params;

  const session = await getSession();
  const { accessToken, user } = session!;

  const [tasks, habit] = await Promise.all([
    TaskService.getByHabitId(accessToken!, habitId),
    getHabitById(user.sub, habitId),
  ]);

  if (!habit) {
    return (
      <p>Habit not found</p>
    );
  }

  return <HabitDetails habit={habit} token={accessToken!} tasks={tasks} />;
};

export default HabitDetailsPage;
