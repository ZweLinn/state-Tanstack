import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../lib/post";

// Helper: simulates updating a post on the server
async function updatePostTitle(postId: number, newTitle: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle })
    });
    if (!res.ok) {
        throw new Error("Failed to update post");
    }
    return res.json();
}

interface Post {
    id: number;
    title: string;
}

export default function OptimisticQueryExample() {
    const queryClient = useQueryClient();

    // 1. Fetch posts data
    const { data, isLoading, isError } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: fetchData
    });

    // 2. Mutation with optimistic update
    const { mutate, isPending } = useMutation({
        mutationFn: ({ postId, title }: { postId: number; title: string }) =>
            updatePostTitle(postId, title),

        // Runs BEFORE the mutation - optimistically update UI
        onMutate: async ({ postId, title }) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            // Snapshot the current value for rollback
            const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

            // Optimistically update the cache
            queryClient.setQueryData<Post[]>(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((post) =>
                    post.id === postId ? { ...post, title } : post
                );
            });

            // Return context to use in onError
            return { previousPosts };
        },

        // On error, rollback using the snapshot from onMutate
        onError: (_err, _newPost, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },

        // Always refetch after error or success to ensure sync with server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    return (
        <div>
            <h3>Optimistic Update Example</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>
                Click "Update" to see the title change instantly (optimistic), 
                then refetch from server to confirm.
            </p>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error fetching posts</p>}

            {data &&
                data.map((post) => (
                    <div key={post.id} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #ddd" }}>
                        <h4>{post.title}</h4>
                        <button
                            onClick={() =>
                                mutate({ postId: post.id, title: `Updated: ${post.title}` })
                            }
                            disabled={isPending}
                        >
                            {isPending ? "Updating..." : "Update Title"}
                        </button>
                    </div>
                ))}
        </div>
    );
}