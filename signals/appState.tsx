import { signal } from "@preact/signals";

export default function createAppState() {
    // const todos = signal([]);
    const NavBarOpen = signal(false);
    // const completed = computed(() => {
    //   return todos.value.filter(todo => todo.completed).length
    // });

    return { NavBarOpen }
  }