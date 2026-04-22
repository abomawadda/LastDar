import { httpClient } from "../../../lib/api/httpClient";

export async function fetchStudentsFromApi(params = {}) {
  const { data } = await httpClient.get("/students", { params });
  return data;
}

export async function createStudentFromApi(payload) {
  const { data } = await httpClient.post("/students", payload);
  return data;
}

