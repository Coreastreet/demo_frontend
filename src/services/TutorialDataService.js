import http from "../http-common";

class TaskDataService {
  getAll() {
    return http.get("/");
  }

  getCompleted() {
    return http.get("/completed");
  }

  getIncomplete() {
    return http.get("/incomplete");
  }

  get(id) {
    return http.post(`/${id}`);
  }

  create(data) {
    return http.post("/", data);
  }

  update(id, data) {
    return http.put(`/${id}`, data);
  }

  delete(id) {
    return http.delete(`/${id}`);
  }

  /**
  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
  */
}

export default new TaskDataService();
