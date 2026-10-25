import { defineStore } from 'pinia';

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: null
    }),
    actions: {
        success(message) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message) {
            const text = typeof message === 'string' ? message : (message?.message || 'Something went wrong. Please try again.');
            this.alert = { message: text, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        }
    }
});