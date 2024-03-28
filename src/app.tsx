import { trpc } from "./client";

export function App() {
  const query = trpc.userList.useQuery();

  return (
    <div>
      {JSON.stringify(query.data)}
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
