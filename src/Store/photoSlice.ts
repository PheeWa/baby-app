import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "../Pages/PhotoPage";
import { photosData } from "./initData";

export interface PhotoState {
  photos: Photo[];
}

const initialState: PhotoState = {
  photos: photosData,
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

    deletePhoto: (state, action: PayloadAction<number>) => {
      state.photos = state.photos.map((photo: Photo) => {
        if (photo.id === action.payload) {
          return { ...photo, image: "" };
        } else {
          return photo;
        }
      });
    },
  },
});

export const { updatePhoto, deletePhoto } = photoSlice.actions;

export default photoSlice.reducer;
