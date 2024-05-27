import {createSlice} from "@reduxjs/toolkit";
import {getNewsById, getNewsFromDb} from "../../../services/NewsService";

interface NewsState {
    ScienceNewsData: any;
    TechnologyData: any;
    BusinessData: any;
    EducationData: any;
    TravelData: any;
    SportData: any;
    newsData: any;
    Loading: boolean;
    Error: any;
}

const initialState: NewsState = {
    ScienceNewsData: null,
    TechnologyData: null,
    BusinessData: null,
    EducationData: null,
    TravelData: null,
    SportData: null,
    newsData: null,
    Loading: false,
    Error: null,
}

export const newsReducer = createSlice({
    name: "newsReducer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNewsFromDb.pending, (state, action) => {
                state.Loading = true;
                state.Error = null;
            })
            .addCase(getNewsFromDb.fulfilled, (state, action) => {
                state.Loading = false;
                state.Error = null;
                const data = action.payload.content;
                if (data.length >= 0) {
                    switch (data[0].topic.topicName) {
                        case "Science":
                            state.ScienceNewsData = null;
                            state.ScienceNewsData = data;
                            break;
                        case 'Technology':
                            state.TechnologyData = null;
                            state.TechnologyData = data;
                            break;
                        case 'Business':
                            state.BusinessData = null;
                            state.BusinessData = data;
                            break;
                        case 'Education':
                            state.EducationData = null;
                            state.EducationData = data;
                            break;
                        case 'Travel':
                            state.TravelData = null;
                            state.TravelData = data;
                            break;
                        case 'Sport':
                            state.SportData = null;
                            state.SportData = data;
                            break;
                        default:
                            break;
                    }
                }
            })
            .addCase(getNewsFromDb.rejected, (state, action) => {
                state.Loading = false;
                state.Error = action.payload;
            }).addCase(getNewsById.fulfilled, (state, action) => {
                state.newsData = null;
                state.newsData = action.payload;
                console.log("state: ", state.newsData)
        });
    }
});


export default newsReducer.reducer;
