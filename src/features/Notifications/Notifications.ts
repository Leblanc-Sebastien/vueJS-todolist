import type { Todo } from '../../interfaces/Todos.interface'

export const toDate = (todo: Todo) => {
  const combinedString = `${todo.deadlineDate}T${todo.deadlineTime.replace('h', ':')}:00`
  return new Date(combinedString)
}

export function notify(title: string) {
  new Notification(title, {
    body: 'Attention, vous êtes en retard pour cette tache.'
  })
}

export const setReminder = (todo: Todo) => {
  const timer = toDate(todo).getTime() - Date.now()
  if (timer > 0 && todo.doneOrNot === false) {
    setTimeout(() => {
      notify(todo.title)
      todo.reminder = true
    }, timer)
  }
}
Notification.requestPermission()

// if ('Notification' in window) {
//     if (Notification.permission === 'granted') {
//         notify()
//     } else {
//         Notification.requestPermission().then(() => {
//             if (res === 'granted') {
//                 notify()
//             } else if (res === 'denied') {
//                 console.log('notification access denied !')
//             } else if (res === 'default') {
//                 console.log('notification not given !')
//             }
//         })
//     }
// }
