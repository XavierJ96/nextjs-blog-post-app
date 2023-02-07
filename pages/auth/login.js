import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup,FacebookAuthProvider, updateProfile } from "firebase/auth";
import {auth} from '../../utils/firebase'
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
    const [user,loading] = useAuthState(auth)
    const route = useRouter() 
    // Sign in with Google 
    const googleProvider = new GoogleAuthProvider();
    
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            console.log(result.user)
            route.push("/dashboard")
        }
        catch (error) {
            console.log(error)
        }
    }

    // Sign in with Facebook
    const fbProvider = new FacebookAuthProvider();
    const FacebookProvider = async () => {
        try {
            const result = await signInWithPopup(auth, fbProvider);
            const credential = await FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            let photoUrl = result.user.photoURL + '?height=500&access_token=' + token;
            await updateProfile(auth.currentUser, {photoURL: photoUrl})
            console.log(result);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() =>{
        if(user){
            route.push('/dashboard')
        }else{
            console.log("login")
        }
    })

  return (
    <div className="shadow-2xl mb-10 mt-32 p-10 text-gray-700 rounded-lg max-w-3xl mx-auto">
      <h2 className="text3xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
      </div>
      <div className="flex flex-col gap-4">
        <button onClick={GoogleLogin} className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
          <FcGoogle className="text-2xl" /> Sign in with Google
        </button>
        <button 
            onClick={FacebookProvider}
            className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
            <AiFillFacebook className="text-2xl text-blue-500" /> Sign in with Facebook
        </button>
      </div>
    </div>
  );
}
