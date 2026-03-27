import { defineStore } from 'pinia'

export const useCommandHistoryStore = defineStore('commandHistory', {
  state: () => ({
    history: [],
  }),
  actions: {
    addCommand({ operation, operationLabel, command }) {
      this.history.unshift({
        id: Date.now(),
        operation,
        operationLabel,
        command,
        timestamp: new Date().toISOString(),
      })
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50)
      }
    },
    deleteCommand(id) {
      this.history = this.history.filter((c) => c.id !== id)
    },
    clearHistory() {
      this.history = []
    },
  },
  persist: true,
})
