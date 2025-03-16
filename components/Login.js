import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";

export default function Login() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Signed in as {session.user.username}</p>
          <Button onClick={() => signOut()} variant="contained" color="secondary">
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={() => signIn()} variant="contained" color="primary">
          Sign In
        </Button>
      )}
    </div>
  );
}
