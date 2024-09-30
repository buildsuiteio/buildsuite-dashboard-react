import { Project } from "@/components/custom/projects-table";
import { getBaseUrl } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null,
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addProject: (state) => { },
    clearProjects: (state) => {
      state.projects = [];
    },
    setProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjects.pending, () => {
      console.log("Projects Loading");
    }).addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    })
  }
});

export const getProjects = createAsyncThunk(
  "project/getProjects",
  async () => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `${await getBaseUrl()}/api/method/bs_customisations.api.get_projects_list`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Projects:", response.data);
      return response.data.projects;
    } catch (error) {
      console.error("Get Projects failed:", error);
      return [];
    }
  }
);

export const { addProject, clearProjects, setProject } = projectSlice.actions;

export default projectSlice.reducer;



