import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <Typography variant="h5">Sign Up</Typography>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSignup} variant="contained">Sign Up</Button>
      <Typography>{message}</Typography>
    </div>
  );
}
