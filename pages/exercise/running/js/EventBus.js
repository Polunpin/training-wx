// eventBus.js
export const eventBus = {
  events: {},

  on(event, callback) {
      if (!this.events[event]) {
          this.events[event] = [];
      }
      this.events[event].push(callback);
  },

  emit(event, data) {
      if (this.events[event]) {
          this.events[event].forEach((callback) => callback(data));
      }
  },

  off(event, callback) {
      if (event && this.events[event]) {
          if (callback) {
              this.events[event] = this.events[event].filter((cb) => cb !== callback);
          } else {
              delete this.events[event];
          }
      }
  }
};
