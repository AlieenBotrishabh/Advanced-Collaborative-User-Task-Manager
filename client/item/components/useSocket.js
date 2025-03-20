import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const useSocket = (projectId) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    socket.emit("joinProject", projectId);

    socket.on("projectUpdated", (data) => {
      if (data.projectId === projectId) {
        setProject((prev) => ({ ...prev, ...data.updates }));
      }
    });

    return () => socket.disconnect();
  }, [projectId]);

  return { project, socket };
};
