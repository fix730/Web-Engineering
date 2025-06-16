<<<<<<< HEAD
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';


=======
import { useDispatch} from "react-redux";
import type {AppDispatch } from "../store";
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4

export const useAppDispatch: () => AppDispatch = useDispatch;