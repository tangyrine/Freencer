/*export async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:5000/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  export async function fetchTasks() {
    try {
      const res = await fetch("http://localhost:5000/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }*/
    export async function fetchProjects() {
      return [
        {
          id: 1,
          name: "Website Redesign",
          deadline: "2025-03-15",
          status: "In Progress",
        },
        {
          id: 2,
          name: "Marketing Strategy",
          deadline: "2025-04-01",
          status: "Pending",
        },
      ];
    }
    
    export async function fetchTasks() {
      return [
        {
          id: 1,
          title: "Design Homepage",
          progress: "50%",
          deadline: "2025-03-10",
          status: "In Progress",
        },
        {
          id: 2,
          title: "Fix Login Bug",
          progress: "80%",
          deadline: "2025-02-25",
          status: "Almost Done",
        },
      ];
    }
    
  