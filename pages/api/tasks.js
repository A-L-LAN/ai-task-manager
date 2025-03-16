import { getSession } from "next-auth/react";
import db from "../../database";

export default async (req, res) => {
if (req.method === "POST") {  // Ensure both task and userId are provided
    const { task, userId, category, priority = "Medium", due_date } = req.body;  // Get userId from request
  
    if (!task || !userId || !category || !priority || !due_date) {
      return res.status(400).json({ error: "Task, userId, category, priority, and due_date are required" });
    }
  
    db.run(
      "INSERT INTO tasks (task, userId, category, priority, due_date) VALUES (?, ?, ?, ?, ?)",
      [task, userId, category, priority, due_date],
      function (err) {
        if (err) {
          console.error("Error inserting task:", err.message); 
          return res.status(500).json({ error: err.message });
        }
        const newTask = { id: this.lastID, task, userId, category, priority, due_date };
        console.log("Task inserted successfully:", newTask);
        res.json(newTask);
      }
    );
  }else if (req.method === "GET") {
  const session = await getSession({ req }); // Get user session
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id; // Get logged-in user ID
  db.all("SELECT id, task, category, priority, due_date FROM tasks WHERE userId = ?", [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("Fetched tasks for user:", userId, rows);
    res.json({ tasks: rows });
  });
}else if (req.method === "DELETE") { 
    const { id, userId } = req.body; // Ensure userId is extracted

    if (!id || !userId) {
      return res.status(400).json({ error: "Task ID and userId are required" });
    }

    db.run(
      "DELETE FROM tasks WHERE id = ? AND userId = ?",
      [id, userId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
          return res
            .status(403)
            .json({ error: "Task not found or unauthorized" });

        res.json({ deleted: this.changes });
      }
    );
  }else if (req.method === "PUT") {
  const { id, task, userId, category, priority, due_date } = req.body;   // Ensure userId is included

  if (!id || !task || !userId || !category || !priority || !due_date) {
    return res.status(400).json({ error: "Task ID, task content, userId, category, priority, and due_date are required" });
  }

  db.run(
    "UPDATE tasks SET task = ?, category = ?, priority = ?, due_date = ? WHERE id = ? AND userId = ?",
    [task, category, priority, due_date, id, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(403).json({ error: "Task not found or unauthorized" });

      res.json({ updated: this.changes });
    }
  );
}else {
  res.status(405).json({ error: "Method not allowed" });
}
};
