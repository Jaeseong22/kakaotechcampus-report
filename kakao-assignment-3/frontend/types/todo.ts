export type TodoFilter = "all" | "active" | "completed";

export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  start_time: string | null;
  end_time: string | null;
  color: string;
  created_at: string;
};

export type TodoPayload = {
  title: string;
  description: string;
  completed?: boolean;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  color?: string;
};
