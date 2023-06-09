<template>
  <div class="hello flex flex-col items-center">
    <div class="justify-center flex py-10">
      <div class="text-4xl">{{ msg }}</div>
    </div>
    <div class="min-h-24 h-auto w-4/5 shadow-md border-gray-500 rounded border my-6 p-6">
      <div class="flex">
        <input v-model="taskName" class="shadow appearance-none border rounded w-full py-2 px-3 
                    text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="To Do..."/>
        <button @click="saveTask(taskName)" class="ml-2 flex-shrink-0 border-4 bg-blue-500 border-transparent hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" type="button">
          Add
        </button>
      </div>
      <label class="w-full my-4 text-left block text-gray-500 font-bold">
        <input checked name="task_states" class="mr-1 leading-tight" type="radio" @click="getAllTasks()">
        <span class="text-sm mr-6">
          All
        </span>
        <input name="task_states" class="mr-1 leading-tight" type="radio" @change="showCompletedTasks()">
        <span class="text-sm mr-6">
          Completed
        </span>
        <input name="task_states" class="mr-1 leading-tight" type="radio" @change="showIncompleteTasks()">
        <span class="text-sm">
          Incomplete
        </span>
      </label>
      <div class="w-full flex my-6 flex-col" id="task-list">
        <div class="w-full flex items-center mb-4" v-for="(task, index) in tasks" :key="task.id">
          <input :readonly="currentTaskIndex != index" :class="'appearance-none bg-transparent border-none w-2/3 text-gray-700 mr-3 py-1 px-2 leading-tight ' + 
          (currentTaskIndex == index ? 'outline-task' : 'outline-none')" type="text" 
          v-model="task.task" aria-label="Full name">
          <div class="flex flex-1 items-center">
            <input :hidden="currentTaskIndex != index" v-model="task.completed" name="task_completion_state" class="mr-1 leading-tight" type="checkbox">
            <span :hidden="currentTaskIndex != index" class="text-sm">
              Done?
            </span>
          </div>
          <button :hidden="currentTaskIndex == index"
            @click="updateCurrentTaskIndex(index)" class="flex-shrink-0 text-gray-500 hover:border-black border py-1 px-2 rounded" type="button">
            <font-awesome-icon icon="fa-solid fa-pencil"/>
          </button>
          <button :hidden="currentTaskIndex != index" 
            @click="updateTask(task.id, task.task, task.completed)" class="flex-shrink-0 text-gray-500 hover:border-black border py-1 px-2 rounded" type="button">
            Update
          </button>
          <button @click="deleteTask(task.id)" class="ml-2 flex-shrink-0 text-gray-500 hover:border-black border py-1 px-2 rounded fa-trash-can" type="button">
            <font-awesome-icon icon="fa-solid fa-trash-can" />
          </button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import TaskDataService from "../services/TutorialDataService";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      tasks: [],
      taskName: "",
      currentTaskIndex: -1
    }
  },
  methods: {
    updateCurrentTaskIndex(index) {
        this.currentTaskIndex = index;
    },
    showIncompleteTasks() {
      TaskDataService.getCompleted()
        .then(response => {
          this.tasks = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    showCompletedTasks() {
      TaskDataService.getIncomplete()
        .then(response => {
          this.tasks = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getAllTasks() {
      TaskDataService.getAll()
        .then(response => {
          this.tasks = response.data;
          // console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateTask(id, updated_task_name, updated_completed_state) {
        var new_task = {
            task: updated_task_name,
            completed: updated_completed_state
        }
        TaskDataService.update(id, new_task)
          .then(response => {
              console.log(response.data);
          }).catch(e => {
              console.log(e);
          });

          this.currentTaskIndex = -1;
    },
    saveTask() {
      var new_task = {
          task: this.taskName,
          completed: false
      }
      //console.log(new_task)
      TaskDataService.create(new_task)
        .then(response => {
          console.log(new_task);
          console.log(response.data);
          new_task.id = response.data.id;
          this.tasks.push(new_task);
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteTask(id) {
      TaskDataService.delete(id)
        .then(response => {
          console.log(response.data);
          if (response.data == true) {
            let index = this.tasks.findIndex(item => item.id == id);
            if (index != -1) {
              this.tasks.splice(index, 1);
            }
          } else {
            console.log("Server returned false; rest api error")
          }
          this.$router.push({ name: "home" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.getAllTasks();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.outline-task {
  outline: 1px solid blue;
  border-radius: 4px;
}
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
