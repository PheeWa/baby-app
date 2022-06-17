import { ActionTypes } from "@mui/base";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "../Pages/PhotoPage";

const initPhotos = [...Array(13)].map((x, i) => {
  return { id: i, month: i, image: "" };
});

export interface PhotoState {
  photos: Photo[];
}

const initialState: PhotoState = {
  photos: initPhotos,
};

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    updatePhoto: (state, action: PayloadAction<Photo>) => {
      state.photos = state.photos.map((photo) => {
        if (photo.id === action.payload.id) {
          return { ...photo, image: action.payload.image };
        } else {
          return photo;
        }
      });
    },
    // editDiaper: (state, action: PayloadAction<Diaper>) => {
    //   state.diapers = state.diapers.map((diaper, index) => {
    //     if (diaper.id === action.payload.id) {
    //       return action.payload;
    //     }
    //     return diaper;
    //   });
    // },
    // recordDiaper: (state, action: PayloadAction<Diaper>) => {
    //   state.diapers.push(action.payload);
    // },
    deletePhoto: (state, action: PayloadAction<number>) => {
      state.photos = state.photos.map((photo: Photo) => {
        if (photo.id === action.payload) {
          return { ...photo, image: "" };
        } else {
          return photo;
        }
      });
      //   state.photos = state.photos.filter((photo: Photo) => {
      //     return photo.id !== action.payload;
      //   });
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePhoto, deletePhoto } = photoSlice.actions;

export default photoSlice.reducer;
