import { Assignee, Task, TaskDetails } from "@/components/custom/task-table";
import { getBaseUrl, logout } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Task2 {
  id: string;
  name: string;
  category: string;
  project: string;
  description: string;
  status: string;
  priority: string;
}

export interface TaskDocument {
  id: string;
  filename: string;
  file_url: string;
  file_url_with_protocol: string;
  filetype: string;
  timestamp_of_upload: string;
}

export interface User {
  id: string;
  full_name: string;
  is_active: number;
  roles: string[];
}

export interface TaskCategory {
  name: string;
  image_url: string;
  img_url_with_protocol: string;
}

export interface TaskUnit {
  name: string;
  symbol: string;
}

interface TaskState {
  tasks: Task[];
  assignees: User[];
  documents: TaskDocument[];
  photos: TaskDocument[];
  categories: TaskCategory[];
  currentTask: Task | null;
  units: TaskUnit[],
  currentTaskDetails: TaskDetails | null;
}

const initialState: TaskState = {
  tasks: [],
  assignees: [],
  documents: [],
  photos: [],
  categories: [],
  units: [],
  currentTask: null,
  currentTaskDetails: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    setTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    setUnits: (state, action: PayloadAction<TaskUnit[]>) => {
      state.units = action.payload;
      console.log("Set Task Units");
      console.log(state.units);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, () => {
        console.log("Tasks Loading");
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      });

    builder
      .addCase(getCategories.pending, () => {
        console.log("Categories Loading");
      })
      .addCase(
        getCategories.fulfilled,
        (state, action: PayloadAction<TaskCategory[]>) => {
          state.categories = action.payload;
        }
      );

    builder
      .addCase(setTaskDetails.pending, () => {
        console.log("Task Details Loading");
      })
      .addCase(
        setTaskDetails.fulfilled,
        (state, action: PayloadAction<TaskDetails>) => {
          state.currentTaskDetails = action.payload;
        }
      );

    builder
      .addCase(setTaskFiles.pending, () => {
        console.log("Task Attachments Loading");
      })
      .addCase(
        setTaskFiles.fulfilled,
        (state, action: PayloadAction<TaskDocument[]>) => {
          state.documents = action.payload.filter(
            (element) => !element.filetype!.includes("image")
          );
          state.photos = action.payload.filter((element) =>
            element.filetype!.includes("image")
          );
        }
      );

    builder
      .addCase(updateTask.pending, () => {
        console.log("Task Updating...");
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<TaskDetails>) => {
          if (action.payload != null) {
            state.currentTaskDetails = action.payload;

          }

          if (state.currentTask != null && action.payload != null) {
            state.currentTask = {
              ...state.currentTask,
              category: action.payload.category,
              status: action.payload.status,
            };
            state.tasks = state.tasks.filter((task) => task.task_id != action.payload.id);
            state.tasks = [state.currentTask, ...state.tasks]
            console.log("SLICE TEST");
          }
        }

      );

    builder
      .addCase(removeAssignee.pending, () => {
        console.log("Removing Assignee");
      })
      .addCase(
        removeAssignee.fulfilled,
        (state, action: PayloadAction<String>) => {
          if (state.currentTaskDetails) {
            state.currentTaskDetails.assignee =
              state.currentTaskDetails.assignee.filter(
                (user) => user.user_email != action.payload
              );
          }
        }
      );

    builder
      .addCase(addAttachments.pending, () => {
        console.log("Adding Attachments");
      })
      .addCase(
        addAttachments.fulfilled,
        (state, action: PayloadAction<TaskDocument[]>) => {
          action.payload.forEach((doc) => {
            if (!doc.filetype.includes('image')) {
              state.documents = [...state.documents, ...action.payload];
            } else {
              state.photos = [...state.photos, ...action.payload];
            }
          })

        }
      );

    builder
      .addCase(getAssignees.pending, () => {
        console.log("Assignees Loading");
      })
      .addCase(
        getAssignees.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          console.log(state.assignees);
          state.assignees = action.payload.filter((element) =>
            !element.roles.includes("Admin") && !element.roles.includes("Manager"),
          );
        }
      );

    builder
      .addCase(addAssigneeToTask.pending, () => {
        console.log("Adding Assignees");
      })
      .addCase(
        addAssigneeToTask.fulfilled,
        (state, action: PayloadAction<Assignee[]>) => {
          if (state.currentTaskDetails) {
            state.currentTaskDetails.assignee = [...state.currentTaskDetails?.assignee, ...action.payload];
          }
        }
      );

    builder
      .addCase(addTask.pending, () => {
        console.log("Creating Task");
      })
      .addCase(
        addTask.fulfilled,
        (state, action: PayloadAction<Task2>) => {
          console.log(action.payload);
          if (action.payload) {
            let newTask: Task = {
              title: action.payload.name,
              task_id: action.payload.id,
              expected_end_date: null,
              status: "Yet To Start",
              category: action.payload.category,
              estimated_work: 100,
              unit: "Percentage",
              progress: 0,
              progress_percentage: 0,
            }

            state.tasks = [...state.tasks, newTask];
          }
        }
      );
  },
});

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (projectId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `${await getBaseUrl()}/api/method/bs_customisations.api.get_tasks_list?project_id=${projectId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Tasks:", response.data);
      return response.data.tasks;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const getCategories = createAsyncThunk(
  "task/getCategories",
  async () => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `${await getBaseUrl()}/api/method/bs_customisations.api.get_task_category_list`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Categories:", response.data);
      return response.data.category_options;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const setTaskDetails = createAsyncThunk(
  "task/setTask",
  async (taskId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `${await getBaseUrl()}/api/method/bs_customisations.api.task_detail_view?task_id=${taskId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Task Detail:", response.data);
      return response.data.task_details;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const setTaskFiles = createAsyncThunk(
  "task/setTaskFiles",
  async (taskId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `${await getBaseUrl()}/api/method/bs_customisations.api.get_task_attachments?task_id=${taskId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Task Attachemnts:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (taskPayload: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.put(
        `${await getBaseUrl()}/api/method/bs_customisations.api.update_task`,
        taskPayload,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Task Updated", response.data);
      return response.data.details;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const removeAssignee = createAsyncThunk(
  "task/removeAssignee",
  async (assigneePayload: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.post(
        `${await getBaseUrl()}/api/method/bs_customisations.api.remove_users_from_task`,
        assigneePayload,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Assignee Removed", response.data);

      if (response.status == 200) {
        return assigneePayload["user_id"];
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const addAttachments = createAsyncThunk(
  "task/addAttachments",
  async (formData: FormData) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.post(
        `${await getBaseUrl()}/api/method/bs_customisations.api.upload_attachment`,
        formData,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Assignee Removed", response.data);

      return response.data.filedata;
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const updateTaskProgress = createAsyncThunk(
  "task/updateTaskProgress",
  async (payload: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }
      const formData = new FormData();
    
      // Append data to FormData
      formData.append('params', JSON.stringify(payload));
      
      const response = await axios.post(
        `${await getBaseUrl()}/api/method/bs_customisations.api.update_task_progress`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Task Progress Updated", response.data);

      return response.data; // Return the response data
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const getAssignees = createAsyncThunk("task/getAssignees", async () => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    if (!apiKey || !apiSecret) {
      throw new Error("Missing API credentials");
    }

    const response = await axios.get(
      `${await getBaseUrl()}/api/method/bs_customisations.api.get_core_team`,
      {
        headers: {
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
      }
    );

    console.log("Get Users:", response.data);
    return response.data.user_list;
  } catch (error: any) {
    console.error("Get Tasks failed:", error);
    if (error.response.status == 401) {
      logout();
    }
    return [];
  }
});

export const addAssigneeToTask = createAsyncThunk(
  "task/addAssigneeToTask",
  async (assigneeData: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.post(
        `${await getBaseUrl()}/api/method/bs_customisations.api.assign_users_to_task`,
        assigneeData,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Add Assignee:", response.data);

      if (response.status == 200) {
        let user: Assignee = {
          user_name: assigneeData["user_id"][0],
          user_email: assigneeData["user_id"][0],
        }
        return [user];
      } else {
        return [];
      }
    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const addTask = createAsyncThunk(
  'task/addTask',
  async (taskData: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");
      const url = `${await getBaseUrl()}/api/method/bs_customisations.api.create_task`;

      const response = await axios.post(url,
        { "params": taskData },
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        },
      );

      if (response.status == 201) {
        return response.data.details;
      } else {
        return null;
      }

    } catch (error: any) {
      console.error("Get Tasks failed:", error);
      if (error.response.status == 401) {
        logout();
      }
      return [];
    }
  }
);

export const { clearTasks, setTask, setUnits } = taskSlice.actions;

export default taskSlice.reducer;
