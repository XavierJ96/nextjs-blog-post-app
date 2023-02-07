import Message from "@/components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, Timestamp, updateDoc, getDoc } from "@firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessages] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Submit message
  const submitMessage = async () => {
    // Check if the user is logged
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      toast.error("Don't leave an empty message 😑", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    console.log(auth)
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    // reset
    setMessages("");
  };

  //   Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const docSnap = await getDoc(docRef);
    setAllMessages(docSnap.data().comments);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}>
        <div className="my-4">
          <div className="flex gap-2">
            <input
              onChange={(e) => setMessages(e.target.value)}
              type="text"
              value={message}
              placeholder="Send a message 😁"
              className="bg-gray-800 w-full p-2 text-white text-sm rounded-md"
            />
            <button
              onClick={submitMessage}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </div>
          <div className="py-6">
            
            <h2 className="font-bold">Comments</h2>
            {allMessages && allMessages.length > 0 ? 
  allMessages.map((message) => (
    <div key={message.time} className="bg-white p-4 my-4 border-2">
      <div className="flex items-center gap-2 mb-4">
        <img 
        className="w-10 rounded-full"
        src={message.avatar} 
        alt="avatar" />
        <h2>{message.userName}</h2>
      </div>
      <h2>{message.message}</h2>
    </div>
  )) 
  : null
}
          </div>
        </div>
      </Message>
    </div>
  );
}
