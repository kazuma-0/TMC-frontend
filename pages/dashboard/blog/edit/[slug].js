import { useCallback, useEffect, useReducer, useState } from "react";
import { frontendClient } from "../../../../client";
import BlogFormReducer from "../../../../reducers/BlogFormReducer";
import { useRouter } from "next/router";
import EditorLayout from "../../../../components/EditorLayout";
import { IconLoader } from "@tabler/icons";
import { useToast } from "@chakra-ui/react";
import { checkUser } from "../../../../utils";
import { useWallet } from "@solana/wallet-adapter-react";

function BlogEdit() {
  const [blogPost, setBlogPost] = useState({});
  const router = useRouter();
  const { slug } = router.query;
  const toast = useToast({
    position: "bottom-right",
    variant: "left-accent",
  });
  const { connected, publicKey } = useWallet();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!connected && publicKey) {
      router.push("/auth");
    }
    if (publicKey !== null && user === null) {
      checkUser(publicKey, setUser);
    }
    if (user) {
      dispatch({
        type: "public key",
        field: "pubKey",
        payload: publicKey.toBase58(),
      });
    }
  }, [publicKey, user]);
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await frontendClient.get(`/api/blog/blog?slug=${slug}`);
        setBlogPost(data);
        console.log(data);
        const keys = Object.keys(data);
        keys.forEach((key) => {
          dispatch({
            type: key,
            field: key,
            payload: data[key],
          });
        });
        console.log(formState);
      } catch (e) {
        console.error(e);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const [formState, dispatch] = useReducer(BlogFormReducer, blogPost);
  const dispatcher = useCallback((e) => {
    console.log(e.target.value);
    dispatch({
      type: e.target.name,
      field: e.target.name,
      payload: e.target.value,
    });
  }, []);

  async function onSubmit() {
    try {
      const { data } = await frontendClient.post(
        "/api/blog/update",
        {
          ...{ ...blogPost, ...formState },
        },
        {}
      );
      toast({
        title: "Post updated successfully",
        description: "Redirecting in a second",
        variant: "left-accent",
        icon: <IconLoader />,
        duration: 1e3,
      });
      setTimeout(() => {
        router.push(`/blog/${data.slug}`);
      }, 1e3);
    } catch (e) {
      console.error(e);
      toast({
        title: "Failed to update post",
        // description: e.request.data.message,
        status: "error",
      });
    }
  }

  return (
    <div className={"-cover"}>
      <h1
        className={
          "text-4xl uppercase font-bold font-ligurino tracking-wider pb-5"
        }
      >
        Edit blog post
      </h1>
      {blogPost.image_url && (
        <EditorLayout
          dispatcher={dispatcher}
          state={formState}
          onSubmit={onSubmit}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

export default BlogEdit;
