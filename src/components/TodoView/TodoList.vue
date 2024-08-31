<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { Todo } from '../../interfaces/Todos.interface'
// import { todosListData } from './todosListData'
import { listTodo } from '@/features/LocalStorage/LocalStorage';
import { setReminder } from '../../features/Notifications/Notifications'

const state = reactive<{
    todoList: Todo[]
}>({
    todoList: listTodo
})

const newTask = ref("")
const newDate = ref("")
const newTime = ref("")

const todofilteredNotDone = computed(() => {
    return state.todoList?.filter((todo) => todo.doneOrNot === false)
})

const todofiltedDone = computed(() => {
    return state.todoList?.filter((todo) => todo.doneOrNot === true)
})

const reminderDone = computed(() => {
    return state.todoList?.filter((todo) => todo.reminder === true)
})

const taskDoneOrNot = (idTodo: number): void => {
    const oldTodo = state.todoList?.find((todo) => todo.id === idTodo)
    if (oldTodo) {
        oldTodo.doneOrNot = !oldTodo.doneOrNot
        oldTodo.reminder = false
        state.todoList = state.todoList?.filter((todo) => todo.id !== idTodo)
        state.todoList?.push(oldTodo)
    }
    const newJSONDatas = JSON.stringify(state.todoList)
    localStorage.clear()
    localStorage.setItem("todoList", newJSONDatas)
}

const addNewTask = (): void => {
    if (newTask.value !== "" && newDate.value !== "" && newTime.value !== "") {
        state.todoList.push({
            id: state.todoList.length + 1,
            title: newTask.value,
            doneOrNot: false,
            deadlineDate: newDate.value,
            deadlineTime: newTime.value,
            reminder: false
        })
        newTask.value = ""
        newDate.value = ""
        newTime.value = ""
        setReminder(todofilteredNotDone.value[todofilteredNotDone.value.length - 1])

        const newJSONDatas = JSON.stringify(state.todoList)
        localStorage.clear()
        localStorage.setItem("todoList", newJSONDatas)
    }
}

const deleteTask = (todoId: number): void => {
    state.todoList = state.todoList.filter((todo) => todo.id != todoId)
    const newJSONDatas = JSON.stringify(state.todoList)
    localStorage.clear()
    localStorage.setItem("todoList", newJSONDatas)
}

onMounted(() => {
    todofilteredNotDone.value.forEach(todo => {
        setReminder(todo)
    });
})

</script>

<template>
    <div class="d-flex flex-column align-item-center justify-content-center">
        <h1 class="m-b-20 m-t-20">Todo-List</h1>
        <div class="todos-container d-flex flex-row  ">
            <div class="notDone d-flex flex-column align-item-center" v-if="todofilteredNotDone.length > 0">
                <h2 class="titleList m-b-20">Taches à faire :</h2>
                <ul class="notDone-list d-flex flex-column">
                    <li class="d-flex flex-row align-item-center" v-for="todo in todofilteredNotDone"
                        v-bind:key="todo.id">
                        <span>{{ todo.title }}</span><button class="done-button"
                            v-on:click="taskDoneOrNot(todo.id)">Done</button>
                    </li>
                </ul>
            </div>
            <div class="reminder d-flex flex-column align-item-center" v-if="reminderDone.length > 0">
                <h2 class="titleList m-b-20">Rappel effectué :</h2>
                <ul class="reminder-list d-flex flex-column">
                    <li class="d-flex flex-row align-item-center" v-for="todo in reminderDone" v-bind:key="todo.id">
                        <span>{{ todo.title }}</span>
                        <pre>Le {{ todo.deadlineDate }} à {{ todo.deadlineTime }}</pre>
                        <div class="button-container d-flex flex-row align-item-center justify-content-center">
                            <!-- <button v-on:click="taskDoneOrNot(todo.id)">Not so</button>
                            <button class="delete-button" v-on:click="deleteTask(todo.id)">X</button> -->
                        </div>
                    </li>
                </ul>
            </div>
            <div class="done d-flex flex-column align-item-center" v-if="todofiltedDone.length > 0">
                <h2 class="titleList m-b-20">Taches terminées :</h2>
                <ul class="done-list d-flex flex-column">
                    <li class="d-flex flex-row align-item-center" v-for="todo in todofiltedDone" v-bind:key="todo.id">
                        <span>{{ todo.title }}</span>
                        <div class="button-container d-flex flex-row align-item-center justify-content-center"><button
                                class="notso-button" v-on:click="taskDoneOrNot(todo.id)">Not so</button>
                            <button class="delete-button" v-on:click="deleteTask(todo.id)">X</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <form v-on:submit.prevent="addNewTask"
            class="addTodo-container d-flex flex-column align-item-center justify-content-center">
            <input type="text" id="addTodo" v-model="newTask">
            <input type="date" v-model="newDate">
            <input type="time" v-model="newTime">
            <button>Add a task</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.todos-container {
    gap: 30px;
    flex-wrap: wrap;

    .notDone {
        background-color: rgb(236, 157, 157);
        padding: 20px;
        border-radius: 5px;
        width: 500px;

        .notDone-list {
            gap: 10px;
            width: 100%;

            li {
                justify-content: space-between;
                background-color: rgb(243, 111, 111);
                padding: 15px;
                border-radius: 5px;
                gap: 20px;
                transition: 0.6s;

                &:hover {
                    background-color: rgb(238, 75, 75);
                }
            }
        }

        .done-button {
            cursor: pointer;
        }
    }

    .done {
        background-color: rgb(165, 236, 165);
        padding: 20px;
        border-radius: 5px;
        width: 500px;

        .done-list {
            gap: 10px;
            width: 100%;

            li {
                justify-content: space-between;
                background-color: rgb(101, 226, 101);
                padding: 15px;
                border-radius: 5px;
                gap: 20px;
                transition: 0.6s;

                &:hover {
                    background-color: rgb(18, 221, 18);
                }
            }
        }

        .button-container {
            gap: 10px;

            .notso-button {
                cursor: pointer;
            }

            .delete-button {
                background-color: rgb(243, 111, 111);
                transition: 0.5s;
                padding: 5px;
                width: 50px;
                cursor: pointer;

                &:hover {
                    background-color: rgb(238, 75, 75)
                }
            }
        }
    }

    .reminder {
        background-color: rgb(247, 195, 128);
        padding: 20px;
        border-radius: 5px;
        width: 500px;

        .reminder-list {
            gap: 10px;
            width: 100%;

            li {
                justify-content: space-between;
                background-color: rgb(253, 171, 65);
                padding: 15px;
                border-radius: 5px;
                gap: 20px;
                transition: 0.6s;

                &:hover {
                    background-color: rgb(255, 146, 4);
                }
            }
        }

        .button-container {
            gap: 10px;

            .delete-button {
                background-color: rgb(243, 111, 111);
                transition: 0.5s;
                padding: 5px;
                width: 50px;
                cursor: pointer;

                &:hover {
                    background-color: rgb(238, 75, 75)
                }
            }
        }
    }

    li {
        list-style: none;

        button {
            padding: 5px;
            background-color: rgb(111, 193, 240);
            transition: 0.5s;
            border-radius: 5px;
            border: none;
        }

        button:hover {
            background-color: rgb(71, 174, 235);
        }
    }
}

.addTodo-container {
    margin-top: 30px;
    gap: 20px;

    input {
        background-color: #d4d4d4;
        width: 500px;
        height: 30px;
        border-radius: 10px;
        padding: 15px;
        font-size: 1.3em;
        border: none;
    }

    input:focus-visible {

        outline: 2px solid rgb(111, 193, 240);
    }

    button {
        width: 300px;
        height: 50px;
        border-radius: 10px;
        font-size: 1.3em;
        background-color: rgb(111, 193, 240);
        transition: 0.5s;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: rgb(71, 174, 235);
    }
}
</style>
