import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import Message from "@/components/message";
import {BsFillTrashFill} from 'react-icons/bs'
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  // Delete post
  const deletePost = async (id) => {
    const docRef = doc(db, 'posts', id,)
    await deleteDoc(docRef)
  };

  //Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="">
      <div>
        <h1 className="text-xl">
          Welcome to your dashboard{" "}
          {user && (
            <span className="text-xl text-blue-500 font-bold">
              {user.displayName}
            </span>
          )}
        </h1>
        <div className="my-6">
          <h1>Your Posts</h1>
          <div className="space-y-4">
            {posts.map((post) => {
              return (
                <Message {...post} key={post.id}>
                  <div className="flex gap-4">
                    <button onClick={() => deletePost(post.id)} className="flex items-center justify-center gap-2 py-2 text-sm">
                      <BsFillTrashFill className="text-red-600"/>
                      Delete
                    </button>
                    <Link href={{pathname: "/post", query: post}}>
                    <button className="flex items-center justify-center gap-2 py-2 text-sm"><AiFillEdit className="text-blue-600"/>Edit</button>
                    </Link>
                  </div>
                </Message>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="py-2 px-4 bg-red-500 font-bold text-white rounded-full mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
