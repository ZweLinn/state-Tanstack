import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const createPost = async (post: { title: string; body: string , userId : number }) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  return res.json();
}
export default function MutationExample() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {mutate , data , isPending , isError , error} = useMutation({mutationFn : createPost})
  return (
    <div >
      <div>2. This is MutationExample</div>

      <input
        title="post title"
        placeholder="post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="post body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      
      <button onClick={() => mutate({title , body , userId : 1})}>
        Submit
      </button>

      {
        isPending && <p>Creating post...</p>
      }
      {
        isError && <p>Error creating post: {(error as Error).message}</p>
      }
      {
        data && (
          <div>
            <h3>Post Created:</h3>
            <p>ID: {data.id}</p>
            <p>Title: {data.title}</p>
            <p>Body: {data.body}</p>
          </div>
        )
      }
    </div>
  );
}
