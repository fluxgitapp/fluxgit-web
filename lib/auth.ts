import { auth, db } from "./firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";

export const signUp = async (email: string, pass: string) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
	const user = userCredential.user;

	// Create Firestore document
	await setDoc(doc(db, "users", user.uid), {
		email: user.email,
		status: "pending",
		createdAt: serverTimestamp(),
	});

	// Set session cookie
	Cookies.set("fb-session", user.uid, { expires: 7 });

	return user;
};

export const signIn = async (email: string, pass: string) => {
	const userCredential = await signInWithEmailAndPassword(auth, email, pass);
	const user = userCredential.user;

	// Set session cookie
	Cookies.set("fb-session", user.uid, { expires: 7 });

	return user;
};

export const signOut = async () => {
	await firebaseSignOut(auth);
	Cookies.remove("fb-session");
};

// Sync auth state with cookie
if (typeof window !== "undefined") {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			Cookies.set("fb-session", user.uid, { expires: 7 });
		} else {
			Cookies.remove("fb-session");
		}
	});
}

export const getCurrentUser = (): Promise<User | null> => {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe();
			resolve(user);
		});
	});
};
