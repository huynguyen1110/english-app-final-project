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
                        case "Science": // 2
                            state.ScienceNewsData = null;
                            state.ScienceNewsData = data;
                            break;
                        case 'Technology': // 3
                            state.TechnologyData = null;
                            state.TechnologyData = data;
                            break;
                        case 'Business': // 4
                            state.BusinessData = null;
                            state.BusinessData = data;
                            break;
                        case 'Education': // 1
                            state.EducationData = null;
                            state.EducationData = data;
                            break;
                        case 'Travel': // 5
                            state.TravelData = null;
                            state.TravelData = data;
                            break;
                        case 'Sport': // 6
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
        });
    }
});


export default newsReducer.reducer;
