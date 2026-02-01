// src/api/catalog.api.js
import axiosClient from "../../utils/axiosClient";

const withPaging = (PageNumber = 1, PageSize = 100) => ({ PageNumber, PageSize });

export const getGradesApi = (PageNumber = 1, PageSize = 100) =>
  axiosClient.get("/api/Grade", { params: withPaging(PageNumber, PageSize) });

export const getSubjectsApi = (PageNumber = 1, PageSize = 100) =>
  axiosClient.get("/api/Subject", { params: withPaging(PageNumber, PageSize) });

export const getChaptersApi = (PageNumber = 1, PageSize = 100) =>
  axiosClient.get("/api/Chapter", { params: withPaging(PageNumber, PageSize) });

export const getLessonsApi = (PageNumber = 1, PageSize = 200) =>
  axiosClient.get("/api/Lesson", { params: withPaging(PageNumber, PageSize) });
