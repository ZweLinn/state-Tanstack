import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const fetchData = async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_ limit=5",
  );
  return res.json();
};
export default function QueryExample() {
  const [loadData, setLoadData] = useState(false);

  const {
    data: posts,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useQuery({ queryKey: ["posts"], queryFn: fetchData, enabled: loadData });

  return (
    <div>
      This is QueryExample
      <button onClick={() => setLoadData(true)}>Load Data</button>
      <button onClick={() => refetch()}>Refetch Data</button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error...</p>}
      {isFetching && <p>Fetching...</p>}
      <ul>
        {posts?.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
