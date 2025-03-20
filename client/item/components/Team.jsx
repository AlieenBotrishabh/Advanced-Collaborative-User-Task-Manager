import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./useSocket";

export default function TeamDashboard({ projectId }) {
  const { project, socket } = useSocket(projectId);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/projects/${projectId}/members`).then((res) => {
      setProject(res.data);
    });

    axios.get(`http://localhost:5000/projects/${projectId}/activity`).then((res) => {
      setActivityLog(res.data);
    });
  }, [projectId]);

  const logActivity = (action) => {
    axios.post(`http://localhost:5000/projects/${projectId}/activity`, {
      action,
      user: "John Doe",
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Project: {project?.name}</h2>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <ul>
          {project?.members?.map((member) => (
            <li key={member.id} className="p-2 bg-gray-100 rounded mt-2">
              {member.name} ({member.role})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Activity Log</h3>
        <ul>
          {activityLog.map((log, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded mt-2">
              {log.user} {log.action} at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
