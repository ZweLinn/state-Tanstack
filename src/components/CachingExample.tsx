import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../lib/post";
import { useState } from "react";

export function Posts(){

   const {data , isLoading , isFetching} = useQuery({
        queryKey : ["posts"],
        queryFn : fetchData,
        staleTime : 1000 * 5,
        gcTime : 1000 * 10
    })
    return (
        <div>
            {
                isLoading && <p>Loading...</p>
            }
            {
                isFetching && <p>Fetching...</p>    
            }

            This is Posts
            {
                data?.map((post : {id : number , title : string}) => (
                    <p key={post.id}>{post.title}</p>
                ))
            }
        </div>
    )
}
export  function CacheingExample() {
  const [show, setShow] = useState(false)

  const InvalidatePost = () => {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({queryKey : ["posts"]})
    // Invalidate the "posts" query to refetch the data
  }
  return (
    <div>
      3. This is CacheingExample
        <button onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"} Posts
        </button>
        {
            show && <Posts/>
        }

        <button onClick={InvalidatePost}>
            Invalidate Post
        </button>
    </div>
  );
}