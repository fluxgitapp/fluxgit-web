import { db } from "./firebase";
import { doc, getDoc, collection, query, onSnapshot, orderBy, setDoc } from "firebase/firestore";

export const getUserStatus = async (uid: string): Promise<string | null> => {
	const userDoc = await getDoc(doc(db, "users", uid));
	if (userDoc.exists()) {
		return userDoc.data().status;
	}
	return null;
};

export const approveUser = async (uid: string) => {
	await setDoc(doc(db, "users", uid), {
		status: "approved",
	}, { merge: true });
};

export const revokeUser = async (uid: string) => {
	await setDoc(doc(db, "users", uid), {
		status: "pending",
	}, { merge: true });
};

export const onUsersChange = (callback: (users: { uid: string; email: string; status: string; role?: string; createdAt?: { seconds: number } }[]) => void) => {
	const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
	return onSnapshot(q, (snapshot) => {
		const users = snapshot.docs.map(doc => ({
			uid: doc.id,
			...doc.data()
		})) as any;
		callback(users);
	});
};
