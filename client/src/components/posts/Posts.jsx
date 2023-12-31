import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";

const Posts = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeRequest.get('/posts').then((res) => res.data),
  })

  return (
    <div className="posts">
      {data && data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;
