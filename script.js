'use strict'

let taskList = []
const submitButton = document.getElementById('submitButton')
const deleteButton = document.getElementById('deleteButton')
let taskListUl = document.getElementById('taskListBox')
let newTaskTitle = document.getElementById('newTaskTitle')
let newTaskDescription = document.getElementById('newTaskDescription')

class ToDoItem {
  constructor(title, description, completed = false) {
    this.title = title
    this.description = description
    this.completed = completed
  }
  getTitle() {
    return this.title
  }
  getDescription() {
    return this.description
  }
  getStatus() {
    return this.completed
  }
}

class ToDoList {
  addNewTask() {
    if (newTaskTitle.value !== '') {
      let newTask = new ToDoItem(newTaskTitle.value, newTaskDescription.value)
      taskList.push(newTask)

      this.displayTasks(taskList)
      this.checkNoTasksMessage()

      //add to localStorage
      this.saveTasks()
    } else {
      alert('Write a Task Title')
    }
  }
  checkNoTasksMessage() {
    const noTasksMessage = document.getElementById('noTasks')
    noTasksMessage.style.display = taskList.length === 0 ? 'block' : 'none'
  }
  removeTask(taskElement, taskToRemove) {
    taskElement.remove()
    taskList = taskList.filter((task) => task !== taskToRemove)
    this.saveTasks()
    this.checkNoTasksMessage()
  }
  editTask(task) {
    task.completed = !task.completed
    console.log(task)
    this.saveTasks()
    return task.completed
  }
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList))
  }
  displayTasks(filteredTasks) {
    console.log('Filtered Tasks:', filteredTasks)
    taskListUl.innerHTML = ''
    filteredTasks.forEach((task) => {
      let li = document.createElement('li')
      console.log(task)

      //create task title
      let h4 = document.createElement('h4')
      h4.setAttribute('id', 'taskTitle')
      h4.innerText = task.title

      //create checkbox for tasks status
      let checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.addEventListener('change', () => this.editTask(task))
      if (task.completed === true) {
        checkbox.checked = true
      } else {
        checkbox.checked = false
      }

      //create description paragraph
      let p = document.createElement('p')
      p.setAttribute('id', 'taskDescription')
      p.innerText = task.description

      //create delete button
      let deleteButton = document.createElement('button')
      deleteButton.setAttribute('id', 'deleteButton')
      deleteButton.innerText = 'Delete'

      //add remove task function to deleteButton
      deleteButton.addEventListener('click', () => this.removeTask(li, task))

      //attach all data from each task
      li.appendChild(checkbox)
      li.appendChild(h4)
      li.appendChild(p)
      li.appendChild(deleteButton)

      //attach new tasks to list of tasks
      taskListUl.appendChild(li)

      //reset values
      newTaskTitle.value = ''
      newTaskDescription.value = ''
    })
    this.checkNoTasksMessage()
  }
  loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem('tasks'))
    if (savedTasks) {
      taskList = savedTasks.map(
        (t) => new ToDoItem(t.title, t.description, t.completed)
      )
    }
    this.displayTasks(taskList)
  }
}

class Filters {
  all() {
    let filteredTasks = taskList.filter(
      (task) => task.completed === true || task.completed === false
    )
    return filteredTasks
  }
  done() {
    let filteredTasks = taskList.filter((task) => task.completed === true)
    return filteredTasks
  }

  toDo() {
    let filteredTasks = taskList.filter((task) => task.completed === false)
    return filteredTasks
  }
}

function editTask() {
  let editTask = new ToDoList()
  return editTask.editTask()
}

let tasks = new ToDoList()

tasks.loadTasks()

submitButton.addEventListener('click', () => tasks.addNewTask())

document.getElementById('allButton').addEventListener('click', () => {
  const getAllTasks = new ToDoList()
  const allTasks = new Filters().all()
  getAllTasks.displayTasks(allTasks)
})

document.getElementById('doneButton').addEventListener('click', () => {
  const getAllTasks = new ToDoList()
  const doneTasks = new Filters().done()
  getAllTasks.displayTasks(doneTasks)
})

document.getElementById('toDoButton').addEventListener('click', () => {
  const getAllTasks = new ToDoList()
  const toDoTasks = new Filters().toDo()
  getAllTasks.displayTasks(toDoTasks)
})
